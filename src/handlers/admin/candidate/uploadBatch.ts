import moment from "moment"
import generatePassword from "generate-password"
// local imports
import helper, {
    getHandlerResponseObject,
    IResponseObject,
    httpStatus,
    log,
    batch as batchHelper,
} from "../../../helper"
import prisma from "../../../prisma"

const create = async (
    userLoginId: number,
    uploaderId: number,
    param: Array<string>
): Promise<void> => {
    const defaultPricingTemplate = await prisma.agentPricingTemplate.findFirst({
        where: {
            isActive: true,
        },
        select: { id: true },
    })

    await prisma.candidateUploadBatch.create({
        data: {
            count: param.length,
            timestamp: moment().utc().format(),
            approvedCount: 0,
            rejectedCount: 0,
            agentPricingTemplate: defaultPricingTemplate?.id,
            createdBy: userLoginId,
            modifiedBy: userLoginId,
            uploadedBy: uploaderId,
            CandidateRaw: {
                createMany: {
                    data: [],
                },
            },
        },
    })
}

const approval = async (
    userLoginId: number,
    batchId: number
): Promise<IResponseObject> => {
    try {
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: batchId,
            },
            select: {
                id: true,
                AgentPricingTemplate: true,
            },
        })
        if (!batchFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Batch not found"
            )

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
            select: {
                id: true,
                fullName: true,
                email1: true,
                CandidateVerification: true,
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
            },
        })

        let batchTotal = 0
        const transactionReqs = []
        const arrCandidateEmail: Array<{
            fullName: string
            password: string
            email?: string
        }> = []
        for (const _candidate of approved) {
            const { CandidateVerification: _verification } = _candidate
            let total = 0
            // 1
            if (_verification?.industry)
                total += batchFound?.AgentPricingTemplate?.industry || 0
            // 2
            if (_verification?.category)
                total += batchFound?.AgentPricingTemplate?.category || 0
            // 3
            if (_verification?.fullName)
                total += batchFound?.AgentPricingTemplate?.fullName || 0
            // 4
            if (_verification?.dob)
                total += batchFound?.AgentPricingTemplate?.dob || 0
            // 5
            if (_verification?.contactNo1)
                total += batchFound?.AgentPricingTemplate?.contactNo1 || 0
            // 6
            if (_verification?.currCity)
                total += batchFound?.AgentPricingTemplate?.currCity || 0
            // 7
            if (_verification?.currZip)
                total += batchFound?.AgentPricingTemplate?.currZip || 0
            // 8
            if (_verification?.email1)
                total += batchFound?.AgentPricingTemplate?.email1 || 0
            // 9
            if (_verification?.primaryLanguage)
                total += batchFound?.AgentPricingTemplate?.primaryLanguage || 0
            // 10
            if (_verification?.secondaryLanguage)
                total +=
                    batchFound?.AgentPricingTemplate?.secondaryLanguage || 0
            // 11
            if (_verification?.skill1)
                total += batchFound?.AgentPricingTemplate?.skill1 || 0
            // 12
            if (_verification?.skill2)
                total += batchFound?.AgentPricingTemplate?.skill2 || 0
            // 13
            if (_verification?.preferLocation1)
                total += batchFound?.AgentPricingTemplate?.preferLocation1 || 0
            // 14
            if (_verification?.preferLocation2)
                total += batchFound?.AgentPricingTemplate?.preferLocation2 || 0
            // 15
            if (_verification?.education)
                total += batchFound?.AgentPricingTemplate?.education || 0
            // 16
            if (_verification?.expYears)
                total += batchFound?.AgentPricingTemplate?.expYears || 0
            // 17
            if (_verification?.lastCompany)
                total += batchFound?.AgentPricingTemplate?.lastCompany || 0
            // 18
            if (_verification?.designation)
                total += batchFound?.AgentPricingTemplate?.designation || 0

            batchTotal += total

            const pwd = generatePassword.generate({
                length: 8,
                numbers: true,
                strict: true,
                lowercase: true,
                uppercase: false,
            })
            const pwdHash = await helper.passwordfunction.encryptPassword(pwd)
            console.log({ id: _candidate.id, pwd })
            transactionReqs.push(
                prisma.candidate.update({
                    where: {
                        id: _candidate.id,
                    },
                    data: {
                        costToAgent: total,
                        status: "APPROVED",
                        modifiedBy: userLoginId,
                        passwordHash: pwdHash,
                    },
                })
            )

            arrCandidateEmail.push({
                fullName: _candidate.fullName,
                email: _candidate.email1 || undefined,
                password: pwd,
            })
        }

        for (const _candidate of rejected) {
            transactionReqs.push(
                prisma.candidate.update({
                    where: {
                        id: _candidate.id,
                    },
                    data: {
                        costToAgent: 0,
                        status: "REJECTED",
                        modifiedBy: userLoginId,
                    },
                })
            )
        }

        transactionReqs.push(
            prisma.candidateUploadBatch.update({
                where: {
                    id: batchFound.id,
                },
                data: {
                    paymentAmount: batchTotal,
                    paymentStatus: "PENDING",
                    status: "PROCESSED",
                    modifiedBy: userLoginId,
                },
            })
        )

        await prisma.$transaction(transactionReqs)

        batchHelper.afterBatchApprovedTelegramNotification(
            batchFound.id,
            "APPROVED",
            userLoginId,
            batchTotal
        )
        batchHelper.afterBatchApprovedEmailToAgent(batchFound.id)
        batchHelper.afterBatchApprovedEmailToCandidates(arrCandidateEmail)

        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Batch approval done successful"
        )
    } catch (error: any) {
        log.error(
            error.toString(),
            "Error while candidate upload batch approval"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while candidate upload batch approval"
        )
    }
}

export default { create, approval }
export { create, approval }
