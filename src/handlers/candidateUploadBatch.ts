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

const getRejectionSummaryForUploadedBatch = async (
    batchId: number
): Promise<helper.IResponseObject> => {
    try {
        // check if batch no exist
        const batchFound = await prisma.candidateUploadBatch.findFirst({
            where: {
                id: batchId,
            },
        })
        if (!batchFound)
            return helper.getHandlerResponseObject(
                true,
                httpStatus.OK,
                "Batch no does not exist"
            )

        const candidateRejectionSummary = await prisma.candidateRejectionSummary.findMany(
            {
                where: {
                    CandidateRawId: {
                        batchId,
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
            }
        )

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
            "Error while getRejectionSummaryForUploadedBatch"
        )
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getRejectionSummaryForUploadedBatch"
        )
    }
}

const CandidateUploadBatch = {
    getAllCandidateUploadBatches,
    getRejectionSummaryForUploadedBatch,
}
export { CandidateUploadBatch }
