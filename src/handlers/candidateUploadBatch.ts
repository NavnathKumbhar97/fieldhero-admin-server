import moment from "moment"
// local imports
import prisma from "../prisma"
import * as helper from "../helper"
import { log, httpStatus } from "../helper"

const getAllCandidateUploadBatches = async (): Promise<helper.IResponseObject> => {
    try {
        const batches = await prisma.candidateUploadBatch.findMany({
            select: {
                id: true,
                timestamp: true,
                count: true,
                status: true,
                approvedCount: true,
                rejectedCount: true,
                CreatedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                        Role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const result = batches.map((batch) => {
            const { CreatedBy, ...rest } = batch
            return {
                ...rest,
                createdBy: CreatedBy?.User.fullName,
                role: CreatedBy?.Role.name,
            }
        })

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getAllCandidateBatches")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAllCandidateBatches"
        )
    }
}

const CandidateUploadBatch = {
    getAllCandidateUploadBatches,
}
export { CandidateUploadBatch }
