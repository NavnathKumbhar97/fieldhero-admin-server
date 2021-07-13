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
        const page = qParam && qParam.page ? parseInt(qParam.page) : 1
        const limit = qParam && qParam.limit ? parseInt(qParam.limit) : 10
        const count = await prisma.candidateUploadBatch.count({
            where: {
                createdBy: userLoginId || undefined,
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
                createdBy: userLoginId || undefined,
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

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            ..._paginate,
            items: batches,
        })
    } catch (error) {
        log.error(
            error.message,
            "Error while fetchAll candidate upload batches"
        )
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
    } catch (error) {
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
    } catch (error) {
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

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Pricing template changed successfully",
            null
        )
    } catch (error) {
        log.error(error.message, "Error while change agent pricing template")
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
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {
            users: result,
        })
    } catch (error) {
        log.error(error.message, "Error while fetchAdminPassiveCreate")
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
                count: true,
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

        const [assigned, pending] = await Promise.all([
            // assigned
            prisma.candidate.count({
                where: {
                    CandidateRawId: {
                        batchId: id,
                    },
                    status: "VERIFICATION_IN_PROGRESS",
                },
            }),
            // pending
            prisma.candidate.count({
                where: {
                    CandidateRawId: {
                        batchId: id,
                    },
                    status: "SYSTEM_VERIFIED",
                },
            }),
        ])

        const completed = batchFound.count - assigned - pending

        const result: {
            count: number
            pending: number
            assigned: number
            completed: number
            uploadedBy: string | undefined
            role: string | undefined
            uploadedAt: Date
        } = {
            count: batchFound.count,
            pending,
            assigned,
            completed,
            uploadedBy: batchFound.CreatedBy?.User.fullName,
            role: batchFound.CreatedBy?.Role.name,
            uploadedAt: batchFound.createdOn,
        }

        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while fetch batch stats by id")
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
