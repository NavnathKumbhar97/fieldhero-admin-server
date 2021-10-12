import prisma from "../prisma"
import {
    log,
    IResponseObject,
    httpStatus,
    getHandlerResponseObject,
    permissions,
} from "../helper"

type IUpdateParam = {
    batchId: number
    assignedTo: Array<number>
}
const update = async (
    userLoginId: number,
    param: IUpdateParam
): Promise<IResponseObject> => {
    try {
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: param.batchId,
            },
        })
        if (!batchFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Batch not found"
            )
        await prisma.$transaction([
            prisma.batchPriority.deleteMany({
                where: {
                    batchId: batchFound.id,
                },
            }),
            prisma.batchPriority.createMany({
                data: param.assignedTo.map((assigned) => ({
                    batchId: param.batchId,
                    assignedTo: assigned,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })),
            }),
        ])
        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Batch priority updated successfully."
        )
    } catch (error: any) {
        log.error(error.message, "Error while update batch priority")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while update batch priority"
        )
    }
}

const fetchAll = async (): Promise<IResponseObject> => {
    try {
        const batchPriorities = await prisma.batchPriority.findMany({
            select: {
                batchId: true,
                AssignedTo: {
                    select: {
                        id: true,
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
            where: {
                BatchId: {
                    status: "IN_PROGRESS",
                },
            },
        })
        const result: Array<{
            batchId: number
            assignedTo: Array<{ id: number; fullName: string }>
        }> = []
        batchPriorities.forEach((batch) => {
            const found = result.find((x) => x.batchId === batch.batchId)
            if (found)
                found.assignedTo.push({
                    id: batch.AssignedTo.id,
                    fullName: batch.AssignedTo.User.fullName,
                })
            else
                result.push({
                    batchId: batch.batchId,
                    assignedTo: [
                        {
                            id: batch.AssignedTo.id,
                            fullName: batch.AssignedTo.User.fullName,
                        },
                    ],
                })
        })

        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while fetch all batch priority")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch all batch priority"
        )
    }
}

const passiveCreate = async (): Promise<IResponseObject> => {
    try {
        const batches = await prisma.candidateUploadBatch.findMany({
            select: {
                id: true,
            },
            where: {
                status: "IN_PROGRESS",
                BatchPriority: {
                    none: {},
                },
                CandidateRaw: {
                    some: {
                        Candidate: {
                            status: "SYSTEM_VERIFIED",
                        },
                    },
                },
            },
        })
        const users = await prisma.userLogin.findMany({
            select: {
                id: true,
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
            where: {
                BatchPriority: {
                    none: {},
                },
                User: {
                    isActive: true,
                },
                Role: {
                    RolePermission: {
                        some: {
                            permissionId:
                                permissions.candidate_verification_create,
                        },
                    },
                },
            },
        })

        const result = {
            batches: batches.map((batch) => batch.id),
            users: users.map((user) => {
                return {
                    id: user.id,
                    fullName: user.User.fullName,
                    role: user.Role.name,
                }
            }),
        }

        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(
            error.message,
            "Error while fetch passive create for batch priority"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch passive create for batch priority"
        )
    }
}

const fetchById = async (id: number): Promise<IResponseObject> => {
    try {
        const batchFound = await prisma.batchPriority.findMany({
            select: {
                batchId: true,
                AssignedTo: {
                    select: {
                        id: true,
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
            where: {
                batchId: id,
            },
        })
        if (batchFound.length <= 0)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Batch with priority not found"
            )
        const result: {
            batchId: number
            assignedTo: Array<{ fullName: string; role: string; id: number }>
        } = {
            batchId: id,
            assignedTo: [],
        }
        batchFound.forEach((batch) => {
            result.assignedTo.push({
                fullName: batch.AssignedTo.User.fullName,
                role: batch.AssignedTo.Role.name,
                id: batch.AssignedTo.id,
            })
        })

        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while fetch batch priority by id")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch batch priority by id"
        )
    }
}

export const BatchPriority = { update, fetchAll, passiveCreate, fetchById }
