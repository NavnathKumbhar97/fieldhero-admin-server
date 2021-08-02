import moment from "moment"
// local imports
import {
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

        let batchTotal = 0
        const transactionReqs = []
        if (batchFound.AgentPricingTemplate) {
            const verifications = await prisma.candidateVerification.findMany({
                where: {
                    CandidateId: {
                        CandidateRawId: {
                            batchId: batchFound.id,
                        },
                    },
                },
            })

            for (const _verification of verifications) {
                let total = 0
                // 1
                if (_verification.industry)
                    total += batchFound.AgentPricingTemplate.industry
                // 2
                if (_verification.category)
                    total += batchFound.AgentPricingTemplate.category
                // 3
                if (_verification.fullName)
                    total += batchFound.AgentPricingTemplate.fullName
                // 4
                if (_verification.dob)
                    total += batchFound.AgentPricingTemplate.dob
                // 5
                if (_verification.contactNo1)
                    total += batchFound.AgentPricingTemplate.contactNo1
                // 6
                if (_verification.currCity)
                    total += batchFound.AgentPricingTemplate.currCity
                // 7
                if (_verification.currZip)
                    total += batchFound.AgentPricingTemplate.currZip
                // 8
                if (_verification.email1)
                    total += batchFound.AgentPricingTemplate.email1
                // 9
                if (_verification.primaryLanguage)
                    total += batchFound.AgentPricingTemplate.primaryLanguage
                // 10
                if (_verification.secondaryLanguage)
                    total += batchFound.AgentPricingTemplate.secondaryLanguage
                // 11
                if (_verification.skill1)
                    total += batchFound.AgentPricingTemplate.skill1
                // 12
                if (_verification.skill2)
                    total += batchFound.AgentPricingTemplate.skill2
                // 13
                if (_verification.preferLocation1)
                    total += batchFound.AgentPricingTemplate.preferLocation1
                // 14
                if (_verification.preferLocation2)
                    total += batchFound.AgentPricingTemplate.preferLocation2
                // 15
                if (_verification.education)
                    total += batchFound.AgentPricingTemplate.education
                // 16
                if (_verification.expYears)
                    total += batchFound.AgentPricingTemplate.expYears
                // 17
                if (_verification.lastCompany)
                    total += batchFound.AgentPricingTemplate.lastCompany
                // 18
                if (_verification.designation)
                    total += batchFound.AgentPricingTemplate.designation

                batchTotal += total
                transactionReqs.push(
                    prisma.candidate.update({
                        where: {
                            id: _verification.candidateId,
                        },
                        data: {
                            costToAgent: total,
                            status: "APPROVED",
                            modifiedBy: userLoginId,
                        },
                    })
                )
            }
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

        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Batch approval done successful"
        )
    } catch (error) {
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
