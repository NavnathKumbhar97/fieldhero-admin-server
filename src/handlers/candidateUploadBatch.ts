import moment from "moment"
import paginate from "jw-paginate"
import { performance } from "perf_hooks"
import { CandidateBatchStatus } from "@prisma/client"

// local imports
import prisma from "../prisma"
import * as helper from "../helper"
import {
    log,
    httpStatus,
    IResponseObject,
    getHandlerResponseObject,
    batch,
} from "../helper"

import logger from "../logs"
import path from "path"

type IFetchAllQueryParam = {
    page?: string
    limit?: string
    mode?: string
}
/**
 * Fetch all candidate upload batches
 * @param userLoginId if null or undefined, it's admin call means it will fetch all batches
 * @param qParam
 * @returns
 */
const fetchAll = async (
    qParam?: IFetchAllQueryParam,
    userLoginId?: number | null
): Promise<helper.IResponseObject> => {
    try {
        console.log("test2",userLoginId);
        
        const page = qParam && qParam.page ? parseInt(qParam.page) : 1
        const limit = qParam && qParam.limit ? parseInt(qParam.limit) : 10
        const count = await prisma.candidateUploadBatch.count({
            where: {
                modifiedBy: userLoginId || undefined,
                //createdBy:userLoginId || undefined
            },
        }) 
        const _paginate = paginate(count, page, limit)
        const batches = await prisma.candidateUploadBatch.findMany({
            select: {
                id: true,
                timestamp: true,
                count: true,
                status: true,
                approvedCount: true,
                rejectedCount: true,
            },
            where: {
                modifiedBy: userLoginId || undefined,
                 //createdBy:userLoginId || undefined
            },
            take: limit,
            skip: _paginate.startIndex >= 0 ? _paginate.startIndex : 0,
            orderBy: {
                modifiedOn: "desc",
            },
        })

        const result = batches.map((batch) => {
            const { ...rest } = batch
            return {
                ...rest,
            }
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchAll |  Message: Candidate upload batches fetched successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            ..._paginate,
            result,count
        })
    } catch (error: any) {
        log.error(
            error.message,
            "Error while fetchAll candidate upload batches"
        )
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchAll |  Message: Error while fetchAll candidate upload batches.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetchAll candidate upload batches"
        )
    }
}

const fetchAllAdmin = async (
    qParam?: IFetchAllQueryParam
): Promise<helper.IResponseObject> => {
    try {
        const page = qParam && qParam.page ? parseInt(qParam.page) : 1
        const limit = qParam && qParam.limit ? parseInt(qParam.limit) : 10
        let mode: CandidateBatchStatus | undefined = undefined
        if (qParam && qParam.mode) {
            mode = batch.getBatchStatusFromMode(qParam.mode)
        }
        const count = await prisma.candidateUploadBatch.count({
            where: {
                status: mode,
            },
        })
        const _paginate = paginate(count, page, limit)
        const batches = await prisma.candidateUploadBatch.findMany({
            where: { status: mode },
            select: {
                id: true,
                timestamp: true,
                count: true,
                status: true,
                approvedCount: true,
                rejectedCount: true,
                AgentPricingTemplate: {
                    select: {
                        id: true,
                        templateName: true,
                    },
                },
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
            take: limit,
            skip: _paginate.startIndex >= 0 ? _paginate.startIndex : 0,
            orderBy: {
                modifiedOn: "desc",
            },
        })

        const result = batches.map((batch) => {
            const { CreatedBy, AgentPricingTemplate, ...rest } = batch
            return {
                ...rest,
                createdBy: CreatedBy?.User.fullName,
                role: CreatedBy?.Role.name,
                AgentPricingTemplate,
            }
        })

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            ..._paginate,
            items: result,
        })
    } catch (error: any) {
        log.error(
            error.message,
            "Error while fetchAllAdmin candidate upload batches"
        )
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetchAllAdmin candidate upload batches"
        )
    }
}

const getRejectionSummary = async (
    batchId: number,
    userLoginId?: number | null
): Promise<helper.IResponseObject> => {
    try {
        // check if batch no exist
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: batchId,
                createdBy: userLoginId || undefined,
            },
        })
        if (!batchFound)
            return helper.getHandlerResponseObject(
                true,
                httpStatus.Not_Found,
                "Batch no does not exist"
            )

        const candidateRejectionSummary =
            await prisma.candidateRejectionSummary.findMany({
                where: {
                    CandidateRawId: {
                        BatchId: {
                            id: batchFound.id,
                            createdBy: userLoginId || undefined,
                        },
                    },
                },
                select: {
                    id: true,
                    columnName: true,
                    rejectionReason: true,
                    rejectionType: true,
                    CandidateRawId: {
                        select: {
                            id: true,
                            rowNum: true,
                        },
                    },
                },
            })

        const arrRejected: Array<any> = []
        const arrIgnored: Array<any> = []
        candidateRejectionSummary.forEach((rejection) => {
            if (rejection.rejectionType === "REJECT")
                arrRejected.push({
                    rowNum: rejection.CandidateRawId.rowNum,
                    [rejection.columnName]: rejection.rejectionReason,
                })
            else
                arrIgnored.push({
                    rowNum: rejection.CandidateRawId.rowNum,
                    [rejection.columnName]: rejection.rejectionReason,
                })
        })

        const candidateRaw = await prisma.candidateRaw.findMany({
            where: {
                id: {
                    in: candidateRejectionSummary.map(
                        (rejection) => rejection.CandidateRawId.id
                    ),
                },
            },
            select: {
                industry: true,
                category: true,
                fullName: true,
                gender: true,
                dob: true,
                contactNo1: true,
                contactNo2: true,
                currAddress: true,
                currCity: true,
                currState: true,
                currZip: true,
                permAddress: true,
                permCity: true,
                permState: true,
                permZip: true,
                email1: true,
                primaryLang: true,
                secondaryLang: true,
                skill1: true,
                skill2: true,
                prefLocation1: true,
                prefLocation2: true,
                expYears: true,
                expMonths: true,
                lastCompany: true,
                designation: true,
                startDate: true,
                endDate: true,
                jobDescription: true,
                aadharNo: true,
                panNo: true,
                dlNo: true,
                rowNum: true,
            },
        })

        const arrSummary = candidateRaw.map((candidate) => ({
            industry: candidate.industry,
            category: candidate.category,
            full_name: candidate.fullName,
            gender: candidate.gender,
            birth_date: candidate.dob,
            primary_mobile: candidate.contactNo1,
            secondary_mobile: candidate.contactNo2,
            curr_address: candidate.currAddress,
            curr_city: candidate.currCity,
            curr_state: candidate.currState,
            curr_pincode: candidate.currZip,
            perm_address: candidate.permAddress,
            perm_city: candidate.permCity,
            perm_state: candidate.permState,
            perm_pincode: candidate.permZip,
            primary_email: candidate.email1,
            primary_lang: candidate.primaryLang,
            secondary_lang: candidate.secondaryLang,
            skill_1: candidate.skill1,
            skill_2: candidate.skill2,
            pref_location_1: candidate.prefLocation1,
            pref_location_2: candidate.prefLocation2,
            exp_years: candidate.expYears,
            exp_months: candidate.expMonths,
            last_company: candidate.lastCompany,
            designation: candidate.designation,
            start_date: candidate.startDate,
            end_date: candidate.endDate,
            job_description: candidate.jobDescription,
            aadhar_no: candidate.aadharNo,
            pan_no: candidate.panNo,
            driving_licence_no: candidate.dlNo,
            row_num: candidate.rowNum,
        }))

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            arrSummary,
            arrRejected,
            arrIgnored,
        })
    } catch (error: any) {
        log.error(
            error.message,
            "Error while getRejectionSummary for uploaded batch"
        )
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getRejectionSummary for uploaded batch"
        )
    }
}

interface IChangeAgentPricingTemplateParam {
    templateId: number
}
const changeAgentPricingTemplate = async (
    userLoginId: number,
    batchId: number,
    param: IChangeAgentPricingTemplateParam
): Promise<helper.IResponseObject> => {
    try {
        if (!param.templateId)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "templateId is required",
                null
            )

        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: batchId,
            },
        })

        // if batch not found
        if (!batchFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate upload batch not found",
                null
            )

        await prisma.candidateUploadBatch.update({
            where: {
                id: batchFound.id,
            },
            data: {
                agentPricingTemplate: param.templateId,
                modifiedBy: userLoginId,
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : changeAgentPricingTemplate |  Message: Pricing template changed successfully.`);
        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Pricing template changed successfully",
            null
        )
    } catch (error: any) {
        log.error(error.message, "Error while change agent pricing template")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : changeAgentPricingTemplate |  Message: Error while change agent pricing template.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while change agent pricing template"
        )
    }
}

const fetchAdminPassiveCreate = async () => {
    try {
        const users = await prisma.userLogin.findMany({
            where: {
                Role: {
                    RolePermission: {
                        some: {
                            permissionId: {
                                in: [74, 74, 61],
                            },
                        },
                    },
                },
            },
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
        })

        const result = users.map((user) => {
            return {
                id: user.id,
                fullName: user.User.fullName,
                role: user.Role.name,
            }
        })

        //
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchAdminPassiveCreate |  Message: Data created successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            users: result,
        })
    } catch (error: any) {
        log.error(error.message, "Error while fetchAdminPassiveCreate")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchAdminPassiveCreate |  Message: Error while fetchAdminPassiveCreate.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetchAdminPassiveCreate"
        )
    }
}

const fetchStatsById = async (
    id: number,
    userLoginId?: number | null
): Promise<IResponseObject> => {
    try {
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            select: {
                id: true,
                count: true,
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
                createdOn: true,
            },
            where: {
                id,
                createdBy: userLoginId ? userLoginId : undefined,
            },
        })
        if (!batchFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Batch not found",
                null
            )

        prisma.candidateVerification.findMany({
            where: {
                CandidateId: {
                    CandidateRawId: {
                        batchId: batchFound.id,
                    },
                    status: "VERIFICATION_IN_PROGRESS",
                },
            },
            select: {
                candidateId: true,
                createdBy: true,
            },
        })

        const [assigned, pending, completed] = await Promise.all([
            // assigned
            prisma.candidateVerification.findMany({
                where: {
                    CandidateId: {
                        CandidateRawId: {
                            batchId: batchFound.id,
                        },
                        status: "VERIFICATION_IN_PROGRESS",
                    },
                },
                select: {
                    candidateId: true,
                    CreatedBy: {
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
            }),
            // pending
            prisma.candidate.count({
                where: {
                    CandidateRawId: {
                        batchId: batchFound.id,
                    },
                    status: "SYSTEM_VERIFIED",
                },
            }),
            // completed
            prisma.candidateVerification.findMany({
                where: {
                    CandidateId: {
                        CandidateRawId: {
                            batchId: batchFound.id,
                        },
                        status: {
                            in: ["OTHER_UPDATE_PENDING", "APPROVAL_PENDING"],
                        },
                    },
                },
                select: {
                    candidateId: true,
                    CreatedBy: {
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
            }),
        ])
        type AssignedTo = {
            id: number | undefined
            name: string | undefined
            stats: {
                assigned: number
                inprogress: number
                completed: number
            }
        }
        const assignedTo: Array<AssignedTo> = []
        assigned.forEach((item) => {
            const found = assignedTo.find((x) => x.id === item.CreatedBy?.id)
            if (found) {
                found.stats.assigned += 1
                found.stats.inprogress += 1
            } else {
                assignedTo.push({
                    id: item.CreatedBy?.id,
                    name: item.CreatedBy?.User.fullName,
                    stats: {
                        assigned: 1,
                        completed: 0,
                        inprogress: 1,
                    },
                })
            }
        })
        completed.forEach((item) => {
            const found = assignedTo.find((x) => x.id === item.CreatedBy?.id)
            if (found) {
                found.stats.assigned += 1
                found.stats.completed += 1
            } else {
                assignedTo.push({
                    id: item.CreatedBy?.id,
                    name: item.CreatedBy?.User.fullName,
                    stats: {
                        assigned: 1,
                        completed: 1,
                        inprogress: 0,
                    },
                })
            }
        })

        const rejectedCount = batchFound.rejectedCount || 0

        const completedCount =
            batchFound.count - assigned.length - pending - rejectedCount

        const result: {
            batchNo: number
            count: number
            pending: number
            assigned: number
            completed: number
            uploadedBy: string | undefined
            assignedTo: Array<AssignedTo>
            role: string | undefined
            uploadedAt: Date
        } = {
            batchNo: batchFound.id,
            count: batchFound.count - rejectedCount,
            pending,
            assigned: assigned.length,
            completed: completedCount,
            uploadedBy: batchFound.CreatedBy?.User.fullName,
            assignedTo,
            role: batchFound.CreatedBy?.Role.name,
            uploadedAt: batchFound.createdOn,
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchStatsById |  Message: Fetch batch stats by id successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while fetch batch stats by id")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchStatsById |  Message: Error while fetch batch stats by id.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch batch stats by id"
        )
    }
}

const CandidateUploadBatch = {
    fetchAll,
    fetchAllAdmin,
    getRejectionSummary,
    changeAgentPricingTemplate,
    fetchAdminPassiveCreate,
    fetchStatsById,
}
export { CandidateUploadBatch }
