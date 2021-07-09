import { Prisma } from "@prisma/client"
// local import
import prisma from "../prisma"
import log from "./log"
import telegram from "./telegram"

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
        const approvalPendingCount = await prisma.candidate.count({
            where: {
                id: candidateId,
                status: "APPROVAL_PENDING",
            },
        })
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
            if (
                approvalPendingCount ===
                uploadBatch.count - (uploadBatch?.rejectedCount || 0)
            ) {
                processBatchCalculation(
                    uploadBatch.id,
                    uploadBatch.count - (uploadBatch?.rejectedCount || 0)
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

const processBatchCalculation = async (batchId: number, batchCount: number) => {
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
            },
        })
        if (pending.length === 0) {
            if (rejected.length + approved.length === batchCount) {
                const reqs = []
                reqs.push(
                    prisma.candidate.updateMany({
                        where: {
                            id: {
                                in: approved.map((x) => x.id),
                            },
                        },
                        data: {
                            status: "APPROVED",
                        },
                    })
                )
                reqs.push(
                    prisma.candidate.updateMany({
                        where: {
                            id: {
                                in: rejected.map((x) => x.id),
                            },
                        },
                        data: {
                            status: "REJECTED",
                        },
                    })
                )
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

                await prisma.$transaction(reqs)

                // send notification on telegram
                let msg = ""
                msg += "\nModule: *Candidate Bulk Upload*\n"
                msg += "✔️Batch processed successfully.✔️ Awaiting approval.\n"
                msg += "\nBatch no: #️⃣*" + batchId + "*\n"
                msg += "Approved: *" + approved.length + "*\n"
                msg += "Rejected: *" + rejected.length + "*\n"
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

export {
    getBatchStatusFromMode,
    processBatchCalculation,
    processLastCandidateFromBatch,
}
export default {
    getBatchStatusFromMode,
    processBatchCalculation,
    processLastCandidateFromBatch,
}
