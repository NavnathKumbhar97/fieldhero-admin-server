import prisma from "../../../prisma"
import moment from "moment"

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

export default { create }
export { create }
