import { Prisma } from "@prisma/client"
import prisma from "../prisma"
import {
    getHandlerResponseObject,
    httpStatus,
    IResponseObject,
    log,
} from "../helper"

// assign new candidate verification to user
const createCandidateVerification = async (
    userLoginId: number
): Promise<IResponseObject> => {
    try {
        const userLoginFound = prisma.userLogin.findFirst({
            where: {
                id: userLoginId,
            },
        })
        if (!userLoginFound) {
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "User not found"
            )
        }
        const countCandidateRawId = await prisma.candidateVersioning.groupBy({
            by: ["candidateRawId"],
            count: {
                candidateRawId: true,
            },
            having: {
                candidateRawId: {
                    count: {
                        equals: 1,
                    },
                },
            },
        })
        if (!countCandidateRawId.length) {
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "No more candidate available for verification"
            )
        }

        const version1 = await prisma.candidateVersioning.findFirst({
            where: {
                candidateRawId: countCandidateRawId[0].candidateRawId,
            },
            select: {
                industry: true,
                category: true,
                fullName: true,
                dob: true,
                gender: true,
                permAddress: true,
                permCity: true,
                permState: true,
                permCountry: true,
                permZip: true,
                currAddress: true,
                currCity: true,
                currState: true,
                currCountry: true,
                currZip: true,
                email1: true,
                email2: true,
                contactNo1: true,
                contactNo2: true,
                aadharNo: true,
                panNo: true,
                dlNo: true,
                registrationStatus: true,
                expYears: true,
                expMonths: true,
                preferLocation1: true,
                preferLocation2: true,
                preferLocation3: true,
                skill1: true,
                skill2: true,
                primaryLanguage: true,
                secondaryLanguage: true,
                thirdLanguage: true,
                lastCompany: true,
                designation: true,
                startDate: true,
                endDate: true,
                jobDescription: true,
                candidateRawId: true,
            },
        })
        if (!version1) {
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "No more candidate available for verification"
            )
        }

        await prisma.candidateVersioning.create({
            data: {
                ...version1,
                version: 2,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                CandidateCallCentreHistory: {
                    create: {
                        candidateConsent: "PENDING",
                        industry: version1.industry !== null ? true : null,
                        category: version1.category !== null ? true : null,
                        fullName: version1.fullName !== null ? true : null,
                        dob: version1.dob !== null ? true : null,
                        gender: version1.gender !== null ? true : null,
                        permAddress:
                            version1.permAddress !== null ? true : null,
                        permCity: version1.permCity !== null ? true : null,
                        permState: version1.permState !== null ? true : null,
                        permCountry:
                            version1.permCountry !== null ? true : null,
                        permZip: version1.permZip !== null ? true : null,
                        currAddress:
                            version1.currAddress !== null ? true : null,
                        currCity: version1.currCity !== null ? true : null,
                        currState: version1.currState !== null ? true : null,
                        currCountry:
                            version1.currCountry !== null ? true : null,
                        currZip: version1.currZip !== null ? true : null,
                        email1: version1.email1 !== null ? true : null,
                        email2: version1.email2 !== null ? true : null,
                        contactNo1: version1.contactNo1 !== null ? true : null,
                        contactNo2: version1.contactNo2 !== null ? true : null,
                        aadharNo: version1.aadharNo !== null ? true : null,
                        panNo: version1.panNo !== null ? true : null,
                        dlNo: version1.dlNo !== null ? true : null,
                        registrationStatus:
                            version1.registrationStatus !== null ? true : null,
                        expYears: version1.expYears !== null ? true : null,
                        expMonths: version1.expMonths !== null ? true : null,
                        preferLocation1:
                            version1.preferLocation1 !== null ? true : null,
                        preferLocation2:
                            version1.preferLocation2 !== null ? true : null,
                        preferLocation3:
                            version1.preferLocation3 !== null ? true : null,
                        skill1: version1.skill1 !== null ? true : null,
                        skill2: version1.skill2 !== null ? true : null,
                        primaryLanguage:
                            version1.primaryLanguage !== null ? true : null,
                        secondaryLanguage:
                            version1.secondaryLanguage !== null ? true : null,
                        thirdLanguage:
                            version1.thirdLanguage !== null ? true : null,
                        lastCompany:
                            version1.lastCompany !== null ? true : null,
                        designation:
                            version1.designation !== null ? true : null,
                        startDate: version1.startDate !== null ? true : null,
                        endDate: version1.endDate !== null ? true : null,
                        jobDescription:
                            version1.jobDescription !== null ? true : null,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    },
                },
            },
        })
        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Version 2 created successfully"
        )
    } catch (error) {
        log.error(error.message, "Error while createCandidateVerification")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCandidateVerification"
        )
    }
}

// get candidate verification assigned to user
const getCandidateVerifications = async (
    userLoginId: number
): Promise<IResponseObject> => {
    try {
        const candidateVerificationFound = await prisma.candidateVersioning.findMany(
            {
                where: {
                    version: 2,
                    CandidateCallCentreHistory: {
                        every: {
                            isSubmitted: false,
                        },
                    },
                    createdBy: userLoginId,
                },
                select: {
                    id: true,
                    fullName: true,
                    contactNo1: true,
                    candidateRawId: true,
                    createdOn: true,
                    modifiedOn: true,
                    CandidateCallCentreHistory: {
                        select: {
                            candidateConsent: true,
                            callStatus: true,
                        },
                        orderBy: {
                            id: "desc",
                        },
                    },
                },
                orderBy: {
                    modifiedOn: "desc",
                },
            }
        )
        const result = candidateVerificationFound.map((item) => {
            const { CandidateCallCentreHistory, ...other } = item
            return {
                ...other,
                callStatus: CandidateCallCentreHistory[0].callStatus,
                candidateConsent:
                    CandidateCallCentreHistory[0].candidateConsent,
            }
        })
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getCandidateVerification")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateVerification"
        )
    }
}

const getCandidateVerificationById = async (
    userLoginId: number,
    itemId: number
): Promise<IResponseObject> => {
    try {
        const candidateVerificationFound = await prisma.candidateVersioning.findFirst(
            {
                where: {
                    version: 2,
                    createdBy: userLoginId,
                    id: itemId,
                    CandidateCallCentreHistory: {
                        every: {
                            isSubmitted: false,
                        },
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
                    primaryLanguage: true,
                    secondaryLanguage: true,
                    skill1: true,
                    skill2: true,
                    preferLocation1: true,
                    preferLocation2: true,
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
                    CandidateCallCentreHistory: {
                        orderBy: {
                            id: "desc",
                        },
                    },
                    CandidateRawId: {
                        select: {
                            batchId: true,
                            rowNum: true,
                            CreatedBy: {
                                select: {
                                    Role: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    User: {
                                        select: {
                                            fullName: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }
        )
        if (!candidateVerificationFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Item not found"
            )
        const {
            CandidateRawId,
            CandidateCallCentreHistory,
            ...other
        } = candidateVerificationFound
        const result = {
            ...other,
            callCentre: CandidateCallCentreHistory,
            batchNo: CandidateRawId.batchId,
            rowNo: CandidateRawId.rowNum,
            createdBy: CandidateRawId.CreatedBy?.User.fullName,
            role: CandidateRawId.CreatedBy?.Role.name,
        }
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getCandidateVerificationById")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateVerificationById"
        )
    }
}

interface IUpdateCandidateVerificationByIdParam {
    industry: string | null
    category: string
    fullName: string
    gender: "MALE" | "FEMALE" | "OTHER" | null
    dob: Date | null
    contactNo1: string
    contactNo2: string | null
    permAddress: string | null
    permCity: string | null
    permState: string | null
    permZip: string | null
    currAddress: string | null
    currCity: string
    currState: string | null
    currZip: string | null
    email1: string | null
    primaryLanguage: string | null
    secondaryLanguage: string | null
    skill1: string | null
    skill2: string | null
    preferLocation1: string | null
    preferLocation2: string | null
    expYears: string | number | null
    expMonths: string | number | null
    lastCompany: string | null
    designation: string | null
    startDate: Date | null
    endDate: Date | null
    jobDescription: string | null
    aadharNo: string | null
    panNo: string | null
    dlNo: string | null
    callCentre: {
        industry: boolean | null
        category: boolean | null
        fullName: boolean | null
        gender: boolean | null
        dob: boolean | null
        contactNo1: boolean | null
        contactNo2: boolean | null
        permAddress: boolean | null
        permCity: boolean | null
        permState: boolean | null
        permZip: boolean | null
        currAddress: boolean | null
        currCity: boolean | null
        currState: boolean | null
        currZip: boolean | null
        email1: boolean | null
        primaryLanguage: boolean | null
        secondaryLanguage: boolean | null
        skill1: boolean | null
        skill2: boolean | null
        preferLocation1: boolean | null
        preferLocation2: boolean | null
        expYears: boolean | null
        expMonths: boolean | null
        lastCompany: boolean | null
        designation: boolean | null
        startDate: boolean | null
        endDate: boolean | null
        jobDescription: boolean | null
        aadharNo: boolean | null
        panNo: boolean | null
        dlNo: boolean | null
        candidateConsent: "PENDING" | "DECLINED" | "RECEIVED"
        callStatus:
            | "BUSY"
            | "CALL_BACK"
            | "COMPLETED"
            | "DISCONNECTED"
            | "HALF_DETAILS"
            | "NOT_INTERESTED"
            | "NOT_REACHABLE"
            | "RINGING"
            | "SWITCH_OFF"
            | "WRONG_NO"
        comment: string | null
        isSubmitted: boolean
    }
}
const updateCandidateVerificationById = async (
    userLoginId: number,
    itemId: number,
    param: IUpdateCandidateVerificationByIdParam
): Promise<IResponseObject> => {
    try {
        const candidateVerificationFound = await prisma.candidateVersioning.findFirst(
            {
                where: {
                    version: 2,
                    createdBy: userLoginId,
                    id: itemId,
                },
                select: {
                    id: true,
                    CandidateRawId: {
                        select: {
                            id: true,
                            BatchId: {
                                select: {
                                    id: true,
                                    approvedCount: true,
                                    rejectedCount: true,
                                    count: true,
                                },
                            },
                        },
                    },
                },
            }
        )
        if (!candidateVerificationFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Item not found"
            )
        await prisma.candidateVersioning.update({
            where: {
                id: candidateVerificationFound.id,
            },
            data: {
                industry: param.industry,
                category: param.category,
                fullName: param.fullName,
                dob: param.dob,
                gender: param.gender,
                contactNo1: param.contactNo1,
                contactNo2: param.contactNo2,
                permAddress: param.permAddress,
                permCity: param.permCity,
                permState: param.permState,
                permZip: param.permZip,
                currAddress: param.currAddress,
                currCity: param.currCity,
                currState: param.currState,
                currZip: param.currZip,
                email1: param.email1,
                primaryLanguage: param.primaryLanguage,
                secondaryLanguage: param.secondaryLanguage,
                skill1: param.skill1,
                skill2: param.skill2,
                preferLocation1: param.preferLocation1,
                preferLocation2: param.preferLocation2,
                expYears: param.expYears
                    ? parseInt(param.expYears as string)
                    : null,
                expMonths: param.expMonths
                    ? parseInt(param.expMonths as string)
                    : null,
                lastCompany: param.lastCompany,
                designation: param.designation,
                startDate: param.startDate,
                endDate: param.endDate,
                jobDescription: param.jobDescription,
                aadharNo: param.aadharNo,
                panNo: param.panNo,
                dlNo: param.dlNo,
                modifiedBy: userLoginId,
                CandidateCallCentreHistory: {
                    create: {
                        industry: param.callCentre.industry,
                        category: param.callCentre.category,
                        fullName: param.callCentre.fullName,
                        dob: param.callCentre.dob,
                        gender: param.callCentre.gender,
                        contactNo1: param.callCentre.contactNo1,
                        contactNo2: param.callCentre.contactNo2,
                        permAddress: param.callCentre.permAddress,
                        permCity: param.callCentre.permCity,
                        permState: param.callCentre.permState,
                        permZip: param.callCentre.permZip,
                        currAddress: param.callCentre.currAddress,
                        currCity: param.callCentre.currCity,
                        currState: param.callCentre.currState,
                        currZip: param.callCentre.currZip,
                        email1: param.callCentre.email1,
                        primaryLanguage: param.callCentre.primaryLanguage,
                        secondaryLanguage: param.callCentre.secondaryLanguage,
                        skill1: param.callCentre.skill1,
                        skill2: param.callCentre.skill2,
                        preferLocation1: param.callCentre.preferLocation1,
                        preferLocation2: param.callCentre.preferLocation2,
                        expYears: param.callCentre.expYears,
                        expMonths: param.callCentre.expMonths,
                        lastCompany: param.callCentre.lastCompany,
                        designation: param.callCentre.designation,
                        startDate: param.callCentre.startDate,
                        endDate: param.callCentre.endDate,
                        jobDescription: param.callCentre.jobDescription,
                        aadharNo: param.callCentre.aadharNo,
                        panNo: param.callCentre.panNo,
                        dlNo: param.callCentre.dlNo,
                        candidateConsent: param.callCentre.candidateConsent,
                        callStatus: param.callCentre.callStatus,
                        comment: param.callCentre.comment,
                        isSubmitted: param.callCentre.isSubmitted,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    },
                },
            },
        })
        // update candidate upload batch if candidate verification is submitted
        if (param.callCentre.isSubmitted) {
            // const isLast =
            //     candidateVerificationFound.CandidateRawId.BatchId.count ===
            //     (candidateVerificationFound.CandidateRawId.BatchId
            //         .approvedCount || 0) +
            //         (candidateVerificationFound.CandidateRawId.BatchId
            //             .rejectedCount || 0) +
            //         1
            // updateCandidateUploadBatch(
            //     userLoginId,
            //     candidateVerificationFound.CandidateRawId.BatchId.id,
            //     param.callCentre.candidateConsent,
            //     isLast
            // )
            if (param.callCentre.candidateConsent === "DECLINED")
                updateCandidateRejectionSummary(
                    userLoginId,
                    candidateVerificationFound.CandidateRawId.id,
                    candidateVerificationFound.CandidateRawId.BatchId.id
                )
        }
        return getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate Verification updated successfully"
        )
    } catch (error) {
        log.error(error.message, "Error while updateCandidateVerificationById")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateVerificationById"
        )
    }
}

const getDashboardForUser = async (
    userLoginId: number
): Promise<IResponseObject> => {
    try {
        const batchCountRequest = prisma.candidateUploadBatch.count({
            where: {
                status: {
                    not: "PROCESSED",
                },
            },
        })
        const pendingCandidatesRequest = prisma.candidateVersioning.groupBy({
            by: ["candidateRawId"],
            count: {
                candidateRawId: true,
            },
            having: {
                candidateRawId: {
                    count: {
                        equals: 1,
                    },
                },
            },
        })
        const assignedCandidateCountRequest = prisma.candidateVersioning.count({
            where: {
                version: 2,
                CandidateCallCentreHistory: {
                    every: {
                        isSubmitted: false,
                    },
                },
                createdBy: userLoginId,
            },
        })
        const [
            batchCount,
            pendingCandidates,
            assignedCandidateCount,
        ] = await Promise.all([
            batchCountRequest,
            pendingCandidatesRequest,
            assignedCandidateCountRequest,
        ])
        const result = {
            count: {
                batch: batchCount,
                candidate: pendingCandidates.length,
                assignedCandidate: assignedCandidateCount,
            },
        }
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getDashboardForUser")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getDashboardForUser"
        )
    }
}

// local method
const updateCandidateUploadBatch = async (
    userLoginId: number,
    batchId: number,
    candidateConsent: "RECEIVED" | "DECLINED" | "PENDING" | null,
    isLast: boolean
) => {
    try {
        await prisma.candidateUploadBatch.update({
            where: {
                id: batchId,
            },
            data: {
                status: isLast ? "PROCESSED" : "IN_PROGRESS",
                rejectedCount:
                    candidateConsent === "DECLINED"
                        ? {
                              increment: 1,
                          }
                        : undefined,
                approvedCount:
                    candidateConsent === "RECEIVED"
                        ? {
                              increment: 1,
                          }
                        : undefined,
                modifiedBy: userLoginId,
            },
        })
    } catch (error) {
        log.error(error.message, "Error while updateCandidateUploadBatch")
    }
}

const updateCandidateRejectionSummary = async (
    userLoginId: number,
    candidateRawId: number,
    batchId: number
) => {
    try {
        const rejectionSummaryReq = prisma.candidateRejectionSummary.create({
            data: {
                columnName: "primary_mobile",
                candidateRawId: candidateRawId,
                rejectedBy: "USER",
                rejectionReason: "CONSENT_DECLINED",
                rejectionType: "REJECT",
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })
        const uploadBatchReq = prisma.candidateUploadBatch.update({
            where: {
                id: batchId,
            },
            data: {
                rejectedCount: {
                    increment: 1,
                },
                modifiedBy: userLoginId,
            },
        })
        await Promise.all([rejectionSummaryReq, uploadBatchReq])
    } catch (error) {
        log.error(error.message, "Error while updateCandidateRejectionSummary")
    }
}

const CandidateVerification = {
    createCandidateVerification,
    getCandidateVerifications,
    getCandidateVerificationById,
    updateCandidateVerificationById,
    getDashboardForUser,
}

export { CandidateVerification }
