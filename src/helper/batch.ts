import { Prisma } from "@prisma/client"
import mjml from "mjml"
// local import
import prisma from "../prisma"
import log from "./log"
import telegram from "./telegram"
import config from "../config"
import { emailTemplate } from "../handlers"
import mailer from "../../nodemailer"

const getBatchStatusFromMode = (
    mode: string
): "IN_PROGRESS" | "ADMIN_APPROVAL_PENDING" | "PROCESSED" | undefined => {
    switch (mode) {
        case "in-progress":
            return "IN_PROGRESS"
        case "pending-approval":
            return "ADMIN_APPROVAL_PENDING"
        case "processed":
            return "PROCESSED"
        default:
            return undefined
    }
}

const processLastCandidateFromBatch = async (candidateId: number) => {
    try {
        const uploadBatch = await prisma.candidateUploadBatch.findFirst({
            where: {
                CandidateRaw: {
                    some: {
                        Candidate: {
                            id: candidateId,
                        },
                    },
                },
            },
            select: {
                count: true,
                rejectedCount: true,
                id: true,
            },
        })
        if (uploadBatch) {
            let approvalPendingCount = await prisma.candidate.count({
                where: {
                    CandidateRawId: {
                        batchId: uploadBatch.id,
                    },
                    status: "APPROVAL_PENDING",
                },
            })
            if (approvalPendingCount === uploadBatch.count) {
                await prisma.candidate.updateMany({
                    where: {
                        CandidateRawId: {
                            CandidateRejectionSummary: {
                                some: {
                                    rejectedBy: "USER",
                                },
                            },
                            batchId: uploadBatch.id,
                        },
                    },
                    data: {
                        status: "REJECTED",
                    },
                })
                approvalPendingCount = await prisma.candidate.count({
                    where: {
                        CandidateRawId: {
                            batchId: uploadBatch.id,
                        },
                        status: "APPROVAL_PENDING",
                    },
                })
            }
            if (
                approvalPendingCount ===
                uploadBatch.count - (uploadBatch?.rejectedCount || 0)
            ) {
                processBatchCalculation(
                    uploadBatch.id,
                    uploadBatch.count - (uploadBatch?.rejectedCount || 0),
                    uploadBatch?.rejectedCount || 0
                )
            }
        }
    } catch (error) {
        log.error(
            error.message,
            "Error while processLastCandidateFromBatch with candidate id " +
                candidateId
        )
    }
}

const processBatchCalculation = async (
    batchId: number,
    batchCount: number,
    systemRejectCount = 0
) => {
    try {
        const approved = await prisma.candidate.findMany({
            where: {
                CandidateCallCentreHistory: {
                    some: {
                        callStatus: "COMPLETED",
                        candidateConsent: "RECEIVED",
                        isSubmitted: true,
                    },
                },
                CandidateRawId: {
                    batchId,
                },
            },
        })
        const rejected = await prisma.candidate.findMany({
            where: {
                CandidateCallCentreHistory: {
                    some: {
                        isSubmitted: true,
                        candidateConsent: "DECLINED",
                    },
                },
                CandidateRawId: {
                    batchId,
                    CandidateRejectionSummary: {
                        none: {
                            rejectedBy: "USER",
                        },
                    },
                },
            },
            select: {
                id: true,
                candidateRawid: true,
                modifiedBy: true,
                CandidateCallCentreHistory: {
                    select: {
                        modifiedBy: true,
                        isSubmitted: true,
                    },
                },
            },
        })
        const pending = await prisma.candidate.findMany({
            where: {
                CandidateCallCentreHistory: {
                    none: {
                        isSubmitted: true,
                    },
                },
                CandidateRawId: {
                    batchId,
                },
            },
        })
        if (pending.length === 0) {
            if (rejected.length + approved.length === batchCount) {
                const reqs = []

                type IRejSummary =
                    Prisma.CandidateRejectionSummaryCreateManyInput
                const rejSummary = rejected
                    .map((reject) => {
                        if (reject.candidateRawid)
                            return {
                                columnName: "primary_mobile",
                                rejectedBy: "USER",
                                rejectById:
                                    reject.CandidateCallCentreHistory.find(
                                        (x) => x.isSubmitted === true
                                    )?.modifiedBy,
                                candidateRawId: reject.candidateRawid,
                                rejectionReason: "CONSENT_DECLINED",
                                rejectionType: "REJECT",
                            } as IRejSummary
                    })
                    .filter<IRejSummary>((x): x is IRejSummary => x != null)

                reqs.push(
                    prisma.candidateRejectionSummary.createMany({
                        data: rejSummary,
                    })
                )
                reqs.push(
                    prisma.candidateUploadBatch.update({
                        where: {
                            id: batchId,
                        },
                        data: {
                            status: "ADMIN_APPROVAL_PENDING",
                            approvedCount: {
                                increment: approved.length,
                            },
                            rejectedCount: {
                                increment: rejected.length,
                            },
                        },
                    })
                )
                reqs.push(
                    prisma.batchPriority.deleteMany({
                        where: {
                            batchId: batchId,
                        },
                    })
                )

                await prisma.$transaction(reqs)

                // send notification on telegram
                let msg = ""
                msg += "\nModule: *Candidate Bulk Upload*\n"
                msg += "✔️Batch processed successfully.✔️ Awaiting approval.\n"
                msg += "\nBatch no: #️⃣ *" + batchId + "*\n"
                msg += "Approved: *" + approved.length + "*\n"
                msg +=
                    "Rejected: *" +
                    (rejected.length + systemRejectCount) +
                    "*\n"
                telegram.sendMessage(msg)
            }
        }
    } catch (error) {
        log.error(
            error.message,
            "Error while processBatchCalculation with batch no " + batchId
        )
    }
}

const afterBatchApprovedTelegramNotification = async (
    batchNo: number,
    approvalStatus: "APPROVED" | "REJECTED",
    approvedBy: number,
    batchTotal: number
) => {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                UserLogin: {
                    id: approvedBy,
                },
            },
        })

        // send telegram notification
        let msg = ""
        msg += "\nModule: *Candidate Bulk Upload*\n"
        msg += "✔️Batch *" + approvalStatus + "* successfully.✔️\n"
        msg += "\nBatch no: #️⃣ *" + batchNo + "*\n"
        msg += "Approved by: *" + userFound?.fullName + "*\n"
        msg += "Amount payable to agent: *" + batchTotal + "* INR\n"
        await telegram.sendMessage(msg)
    } catch (error) {
        log.error(
            error.toString(),
            "Error while afterBatchApprovedTelegramNotification"
        )
    }
}

const afterBatchApprovedEmailToAgent = async (batchNo: number) => {
    try {
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: batchNo,
            },
            select: {
                id: true,
                count: true,
                approvedCount: true,
                rejectedCount: true,
                paymentAmount: true,
                CreatedBy: {
                    select: {
                        User: true,
                        roleId: true,
                        email: true,
                    },
                },
            },
        })

        // if batch not found or batch owner is not agent
        if (!batchFound || batchFound.CreatedBy?.roleId !== 3) return

        const html = mjml(
            emailTemplate.batchApprovedToAgent(
                batchFound.CreatedBy.User.fullName,
                batchFound.id,
                batchFound.count,
                batchFound.approvedCount || 0,
                batchFound.rejectedCount || 0,
                batchFound.paymentAmount || 0
            )
        ).html

        mailer.sendMail({
            to: [batchFound.CreatedBy.email],
            from: config.EMAIL_FROM,
            subject: "FieldHero - Batch Processed",
            html,
        })
    } catch (error) {
        log.error(
            error.toString(),
            "Error while afterBatchApprovedEmailToAgent"
        )
    }
}

export {
    getBatchStatusFromMode,
    processBatchCalculation,
    processLastCandidateFromBatch,
    afterBatchApprovedTelegramNotification,
    afterBatchApprovedEmailToAgent,
}
export default {
    getBatchStatusFromMode,
    processBatchCalculation,
    processLastCandidateFromBatch,
    afterBatchApprovedTelegramNotification,
    afterBatchApprovedEmailToAgent,
}
