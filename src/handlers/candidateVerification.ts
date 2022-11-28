import { Prisma } from "@prisma/client"
import prisma from "../prisma"
import {
    getHandlerResponseObject,
    httpStatus,
    IResponseObject,
    log,
    batch,
} from "../helper"
import logger from "../logs"
import path from "path"

// assign new candidate verification to user
const createCandidateVerification = async (
    userLoginId: number
): Promise<IResponseObject> => {
    try {
        const batchPriority = await prisma.batchPriority.findFirst({
            select: {
                batchId: true,
            },
            where: {
                assignedTo: userLoginId,
            },
        })

        let assignedCandidate = undefined
        // if batch priority for user
        if (batchPriority)
            assignedCandidate = await prisma.candidate.findFirst({
                include: {
                    CandidateRawId: {
                        select: {
                            industry: true,
                            category: true,
                            lastCompany: true,
                            designation: true,
                            education: true,
                        },
                    },
                },
                where: {
                    status: "SYSTEM_VERIFIED",
                    CandidateRawId: {
                        BatchId: {
                            id: batchPriority
                                ? batchPriority.batchId
                                : undefined,
                        },
                    },
                },
            })

        // if no batch priority for user or no more candidate in assigned batch
        if (!batchPriority || !assignedCandidate)
            assignedCandidate = await prisma.candidate.findFirst({
                include: {
                    CandidateRawId: {
                        select: {
                            industry: true,
                            category: true,
                            lastCompany: true,
                            designation: true,
                            education: true,
                        },
                    },
                },
                where: {
                    status: "SYSTEM_VERIFIED",
                    CandidateRawId: {
                        BatchId: {
                            BatchPriority: {
                                none: {},
                            },
                        },
                    },
                },
            })

        if (!assignedCandidate?.candidateRawid){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : createCandidateVerification | Message: No more candidate available for verification.`);
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "No more candidate available for verification"
                )
            }

        await prisma.$transaction([
            prisma.candidate.update({
                where: {
                    id: assignedCandidate.id,
                },
                data: {
                    status: "VERIFICATION_IN_PROGRESS",
                    CandidateVerification: {
                        create: {
                            industry: assignedCandidate.CandidateRawId?.industry
                                ? true
                                : null,
                            category: assignedCandidate.CandidateRawId?.category
                                ? true
                                : null,
                            fullName:
                                assignedCandidate.fullName !== null
                                    ? true
                                    : null,
                            dob: assignedCandidate.dob !== null ? true : null,
                            contactNo1:
                                assignedCandidate.contactNo1 !== null
                                    ? true
                                    : null,
                            currCity:
                                assignedCandidate.currCity !== null
                                    ? true
                                    : null,
                            currZip:
                                assignedCandidate.currZip !== null
                                    ? true
                                    : null,
                            email1:
                                assignedCandidate.email1 !== null ? true : null,
                            primaryLanguage:
                                assignedCandidate.primaryLanguage !== null
                                    ? true
                                    : null,
                            secondaryLanguage:
                                assignedCandidate.secondaryLanguage !== null
                                    ? true
                                    : null,
                            skill1:
                                assignedCandidate.skill1 !== null ? true : null,
                            skill2:
                                assignedCandidate.skill2 !== null ? true : null,
                            preferLocation1:
                                assignedCandidate.preferLocation1 !== null
                                    ? true
                                    : null,
                            preferLocation2:
                                assignedCandidate.preferLocation2 !== null
                                    ? true
                                    : null,
                            education: assignedCandidate.CandidateRawId
                                ?.education
                                ? true
                                : null,
                            expYears:
                                assignedCandidate.expYears !== null
                                    ? true
                                    : null,
                            lastCompany: assignedCandidate.CandidateRawId
                                ?.lastCompany
                                ? true
                                : null,
                            designation: assignedCandidate.CandidateRawId
                                ?.designation
                                ? true
                                : null,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    },
                },
            }),
        ])
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : createCandidateVerification | Message: Candidate verification created successfully.`);

        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Candidate verification created successfully"
        )
    } catch (error: any) {
        log.error(error.message, "Error while createCandidateVerification")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : createCandidateVerification | Message: Error while createCandidateVerification.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCandidateVerification"
        )
    }
}

// get candidate verification assigned to user
const getCandidateVerifications = async (
    userLoginId: number | null | undefined,
    take:any,skip:any
): Promise<IResponseObject> => {
    try {
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.candidate.count({
            where: {
                createdBy: userLoginId,
            },
        })
        const candidates = await prisma.candidate.findMany({take:limit,skip:page,
            select: {
                id: true,
                fullName: true,
                contactNo1: true,
                modifiedOn: true,
                CandidateRawId: {
                    select: {
                        batchId: true,
                    },
                },
                CandidateCallCentreHistory: {
                    select: {
                        candidateConsent: true,
                        callStatus: true,
                    },
                    orderBy: {
                        id: "desc",
                    },
                },
                CandidateVerification: {
                    select: {
                        createdOn: true,
                    },
                },
            },
            where: {
                CandidateVerification: {
                    createdBy: userLoginId ? userLoginId : undefined,
                },
                status: "VERIFICATION_IN_PROGRESS",
            },
            orderBy: {
                modifiedOn: "desc",
            },
        })

        const result = candidates.map((candidate) => {
            const {
                CandidateCallCentreHistory,
                CandidateRawId,
                CandidateVerification,
                ...other
            } = candidate
            return {
                ...other,
                callStatus: CandidateCallCentreHistory.length
                    ? CandidateCallCentreHistory[0].callStatus
                    : null,
                candidateConsent: CandidateCallCentreHistory.length
                    ? CandidateCallCentreHistory[0].candidateConsent
                    : null,
                createdOn: CandidateVerification?.createdOn,
                batchNo: CandidateRawId?.batchId,
            }
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCandidateVerification | Message: Candidate verification fetched successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", {result,count})
    } catch (error: any) {
        log.error(error.message, "Error while getCandidateVerification")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCandidateVerification | Message: Error while getCandidateVerification.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateVerification"
        )
    }
}

const getCandidateVerificationById = async (
    userLoginId: number | undefined | null,
    itemId: number
): Promise<IResponseObject> => {
    try {
        const candidateFound = await prisma.candidate.findFirst({
            select: {
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
                thirdLanguage: true,
                skill1: true,
                skill2: true,
                preferLocation1: true,
                preferLocation2: true,
                expYears: true,
                aadharNo: true,
                panNo: true,
                dlNo: true,
                education: true,
                note: true,
                status: true,
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
                CandidateIndustry: {
                    select: {
                        id: true,
                        title: true,
                        industryId: true,
                    },
                },
                CandidateCategory: {
                    select: {
                        id: true,
                        title: true,
                        categoryId: true,
                    },
                },
                CandidateWorkHistory: {
                    select: {
                        id: true,
                        company: true,
                        industryId: true,
                        industryTitle: true,
                        categoryId: true,
                        categoryTitle: true,
                        startDate: true,
                        endDate: true,
                        description: true,
                        isEmployed: true,
                    },
                },
                CandidateCallCentreHistory: {
                    select: {
                        id: true,
                        candidateConsent: true,
                        callStatus: true,
                        comment: true,
                        createdOn: true,
                    },
                    orderBy: {
                        id: "desc",
                    },
                },
                CandidateRawId: {
                    select: {
                        id: true,
                        batchId: true,
                        rowNum: true,
                        category: true,
                        industry: true,
                        education: true,
                        lastCompany: true,
                        designation: true,
                        primaryLang: true,
                        secondaryLang: true,
                    },
                },
                CandidateVerification: true,
            },
            where: {
                id: itemId,
                status: "VERIFICATION_IN_PROGRESS",
                CandidateVerification: {
                    createdBy: userLoginId ? userLoginId : undefined,
                },
            },
        })

        if (!candidateFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Item not found"
            )

        const {
            CandidateRawId,
            CandidateCallCentreHistory,
            CandidateVerification,
            CreatedBy,
            ...other
        } = candidateFound
        const result = {
            ...other,
            batchNo: CandidateRawId?.batchId,
            callCentre: CandidateCallCentreHistory,
            verification: CandidateVerification,
            createdBy: CreatedBy?.User.fullName,
            role: CreatedBy?.Role.name,
            rowNo: CandidateRawId?.rowNum,
            category: CandidateRawId?.category,
            industry: CandidateRawId?.industry,
            educationRaw: CandidateRawId?.education,
            lastCompany: CandidateRawId?.lastCompany,
            designation: CandidateRawId?.designation,
            primaryLanguageRaw: CandidateRawId?.primaryLang,
            secondaryLanguageRaw: CandidateRawId?.secondaryLang,
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCandidateVerificationById | Message: Candidate verification fetched by id successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getCandidateVerificationById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCandidateVerificationById | Message: Error while getCandidateVerificationById.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateVerificationById"
        )
    }
}

interface IUpdateCandidateVerificationByIdParam {
    fullName: string
    gender?: "MALE" | "FEMALE" | "OTHER" | null
    dob?: Date | null
    contactNo1: string
    contactNo2?: string | null
    currAddress?: string | null
    currCity: string
    currState?: string | null
    currZip?: string | null
    permAddress?: string | null
    permCity?: string | null
    permState?: string | null
    permZip?: string | null
    email1?: string | null
    primaryLanguage?: string | null
    secondaryLanguage?: string | null
    thirdLanguage?: string | null
    skill1?: string | null
    skill2?: string | null
    preferLocation1?: string | null
    preferLocation2?: string | null
    expYears?: string | number | null
    aadharNo?: string | null
    panNo?: string | null
    dlNo?: string | null
    education?: string | null
    note?: string | null
    callCentre: {
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
        comment?: string | null
        isSubmitted: boolean
    }
    verification: {
        industry: boolean | null
        category: boolean | null
        fullName: boolean | null
        dob: boolean | null
        contactNo1: boolean | null
        currCity: boolean | null
        currZip: boolean | null
        email1: boolean | null
        primaryLanguage: boolean | null
        secondaryLanguage: boolean | null
        skill1: boolean | null
        skill2: boolean | null
        preferLocation1: boolean | null
        preferLocation2: boolean | null
        education: boolean | null
        expYears: boolean | null
        lastCompany: boolean | null
        designation: boolean | null
    }
    industries: Array<{
        id: number
        title?: string | null
    }>
    categories: Array<{
        id: number
        title?: string | null
    }>
    workExps: Array<{
        company?: string | null
        industry?: number | null
        industryTitle?: string | null
        category?: number | null
        categoryTitle?: string | null
        startDate?: Date | null
        endDate?: Date | null
        description?: string | null
        isEmployed?: boolean | null
    }>
}
const updateCandidateVerificationById = async (
    userLoginId: number,
    itemId: number,
    param: IUpdateCandidateVerificationByIdParam
): Promise<IResponseObject> => {
    try {
        const candidateFound = await prisma.candidate.findFirst({
            where: {
                id: itemId,
                status: "VERIFICATION_IN_PROGRESS",
            },
            select: {
                id: true,
                CandidateVerification: {
                    select: {
                        id: true,
                    },
                },
            },
        })
        if (!candidateFound){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : updateCandidateVerificationById | Message: Item not found.`);
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Item not found"
                )
            }

        const requests = []
        if (param.callCentre.candidateConsent === "RECEIVED") {
            requests.push(
                prisma.candidate.update({
                    where: {
                        id: candidateFound.id,
                    },
                    data: {
                        fullName: param.fullName.toUpperCase(),
                        dob: param.dob,
                        gender: param.gender,
                        contactNo1: param.contactNo1,
                        contactNo2: param.contactNo2,
                        permAddress:
                            param.permAddress &&
                            param.permAddress.toUpperCase(),
                        permCity:
                            param.permCity && param.permCity.toUpperCase(),
                        permState:
                            param.permState && param.permState.toUpperCase(),
                        permZip: param.permZip,
                        currAddress:
                            param.currAddress &&
                            param.currAddress.toUpperCase(),
                        currCity:
                            param.currCity && param.currCity.toUpperCase(),
                        currState:
                            param.currState && param.currState.toUpperCase(),
                        currZip: param.currZip,
                        email1: param.email1,
                        primaryLanguage: param.primaryLanguage as any,
                        secondaryLanguage: param.secondaryLanguage as any,
                        thirdLanguage:
                            param.thirdLanguage &&
                            param.thirdLanguage.toUpperCase(),
                        skill1: param.skill1 && param.skill1.toUpperCase(),
                        skill2: param.skill2 && param.skill2.toUpperCase(),
                        preferLocation1:
                            param.preferLocation1 &&
                            param.preferLocation1.toUpperCase(),
                        preferLocation2:
                            param.preferLocation2 &&
                            param.preferLocation2.toUpperCase(),
                        expYears: param.expYears
                            ? parseInt(param.expYears as string)
                            : null,
                        aadharNo: param.aadharNo,
                        panNo: param.panNo && param.panNo.toUpperCase(),
                        dlNo: param.dlNo && param.dlNo.toUpperCase(),
                        education:
                            param.education && param.education.toUpperCase(),
                        note: param.note,
                        modifiedBy: userLoginId,
                        CandidateVerification: {
                            update: {
                                industry: param.verification.industry,
                                category: param.verification.category,
                                fullName: param.verification.fullName,
                                dob: param.verification.dob,
                                contactNo1: param.verification.contactNo1,
                                currCity: param.verification.currCity,
                                currZip: param.verification.currZip,
                                email1: param.verification.email1,
                                primaryLanguage:
                                    param.verification.primaryLanguage,
                                secondaryLanguage:
                                    param.verification.secondaryLanguage,
                                skill1: param.verification.skill1,
                                skill2: param.verification.skill2,
                                preferLocation1:
                                    param.verification.preferLocation1,
                                preferLocation2:
                                    param.verification.preferLocation2,
                                education: param.verification.education,
                                expYears: param.verification.expYears,
                                lastCompany: param.verification.lastCompany,
                                designation: param.verification.designation,
                                modifiedBy: userLoginId,
                            },
                        },
                    },
                })
            )

            requests.push(
                prisma.candidateIndustry.deleteMany({
                    where: {
                        candidateId: candidateFound.id,
                    },
                })
            )

            requests.push(
                prisma.candidateIndustry.createMany({
                    data: param.industries.map((industry) => ({
                        candidateId: candidateFound.id,
                        industryId: industry.id,
                        title: industry.title && industry.title.toUpperCase(),
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    })),
                })
            )

            requests.push(
                prisma.candidateCategory.deleteMany({
                    where: {
                        candidateId: candidateFound.id,
                    },
                })
            )

            requests.push(
                prisma.candidateCategory.createMany({
                    data: param.categories.map((category) => ({
                        candidateId: candidateFound.id,
                        categoryId: category.id,
                        title: category.title && category.title.toUpperCase(),
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    })),
                })
            )

            requests.push(
                prisma.candidateWorkHistory.deleteMany({
                    where: {
                        candidateId: candidateFound.id,
                    },
                })
            )

            requests.push(
                prisma.candidateWorkHistory.createMany({
                    data: param.workExps.map((workExp) => ({
                        candidateId: candidateFound.id,
                        company:
                            workExp.company && workExp.company.toUpperCase(),
                        industryId: workExp.industry,
                        industryTitle:
                            workExp.industryTitle &&
                            workExp.industryTitle.toUpperCase(),
                        categoryId: workExp.category,
                        categoryTitle:
                            workExp.categoryTitle &&
                            workExp.categoryTitle.toUpperCase(),
                        startDate: workExp.startDate,
                        endDate: workExp.endDate,
                        description: workExp.description,
                        isEmployed: workExp.isEmployed,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    })),
                })
            )
        }

        requests.push(
            prisma.candidateCallCentreHistory.create({
                data: {
                    candidateConsent: param.callCentre.candidateConsent,
                    comment: param.callCentre.comment,
                    callStatus: param.callCentre.callStatus,
                    isSubmitted: param.callCentre.isSubmitted,
                    candidateId: itemId,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                },
            })
        )

        // if submitted
        let isOther = false
        if (param.callCentre.isSubmitted) {
            if (
                param.industries.findIndex((x) => x.id === 1) > -1 ||
                param.categories.findIndex((x) => x.id === 1) > -1 ||
                param.workExps.findIndex((x) => x.category === 1) > -1 ||
                param.workExps.findIndex((x) => x.industry === 1) > -1
            ) {
                isOther = true
            }

            requests.push(
                prisma.candidate.update({
                    where: {
                        id: candidateFound.id,
                    },
                    data: {
                        status:
                            param.callCentre.candidateConsent !== "RECEIVED"
                                ? "APPROVAL_PENDING"
                                : isOther
                                ? "OTHER_UPDATE_PENDING"
                                : "APPROVAL_PENDING",
                    },
                })
            )
        }

        await prisma.$transaction(requests)
        if (param.callCentre.isSubmitted) {
            batch.processLastCandidateFromBatch(candidateFound.id)
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateCandidateVerificationById | Message: Candidate Verification updated successfully.`);
        return getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate Verification updated successfully"
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateCandidateVerificationById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateCandidateVerificationById | Message: Error while updateCandidateVerificationById.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateVerificationById"
        )
    }
}

const fetchPassiveUpdate = async (): Promise<IResponseObject> => {
    try {
        const [industries, categories] = await Promise.all([
            prisma.industry.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    title: true,
                },
            }),
            prisma.category.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    title: true,
                },
            }),
        ])
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchPassiveUpdate | Message: Candidate fetch Passiv update successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", {
            industries,
            categories,
        })
    } catch (error: any) {
        log.error(error.message, "Error while fetchPassiveUpdate")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchPassiveUpdate | Message: Error while fetchPassiveUpdate.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetchPassiveUpdate"
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
        const pendingCandidatesRequest = prisma.candidate.count({
            where: {
                status: "SYSTEM_VERIFIED",
            },
        })
        const assignedCandidateCountRequest =
            prisma.candidateVerification.count({
                where: {
                    createdBy: userLoginId,
                    CandidateId: {
                        CandidateCallCentreHistory: {
                            every: {
                                isSubmitted: false,
                            },
                        },
                    },
                },
            })
        const [batchCount, pendingCandidates, assignedCandidateCount] =
            await Promise.all([
                batchCountRequest,
                pendingCandidatesRequest,
                assignedCandidateCountRequest,
            ])
        const result = {
            count: {
                batch: batchCount,
                candidate: pendingCandidates,
                assignedCandidate: assignedCandidateCount,
            },
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getDashboardForUser | Message: Get Dashboard For User successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getDashboardForUser")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getDashboardForUser | Message: Error while getDashboardForUser.`);
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
    } catch (error: any) {
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
    } catch (error: any) {
        log.error(error.message, "Error while updateCandidateRejectionSummary")
    }
}

const CandidateVerification = {
    createCandidateVerification,
    getCandidateVerifications,
    getCandidateVerificationById,
    updateCandidateVerificationById,
    getDashboardForUser,
    fetchPassiveUpdate,
}

export { CandidateVerification }
