import { Prisma } from "@prisma/client"
import moment from "moment"
import paginate from "jw-paginate"
import { performance } from "perf_hooks"
// local imports
import prisma from "../prisma"
import * as helper from "../helper"
import { log, httpStatus, telegram } from "../helper"
import { IRejected } from "../helper/candidate"

const {
    handleString,
    handleNotNullString,
    handleNotNullNumber,
    handleNumber,
    handleDate,
    handleEmail,
} = helper.candidate

/*
 * get All Get Candidates
 */

interface IGetCandidatesParam {
    all: string
    page: string
    limit: string
}
const getCandidates = async (
    param: IGetCandidatesParam
): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (param.all == "*") whereCondition = undefined
        const page = "page" in param ? parseInt(param.page) : 1,
            limit = "limit" in param ? parseInt(param.limit) : 10

        const count = await prisma.candidate.count()

        const _paginate = paginate(count, page, limit)
        const candidates = await prisma.candidate.findMany({
            where: {
                isActive: whereCondition,
                status: "APPROVED",
            },
            include: {
                CandidateOther: true,
                CandidateTraining: true,
                CandidateJobPreference: true,
            },
            take: limit,
            skip: _paginate.startIndex >= 0 ? _paginate.startIndex : 0,
            orderBy: {
                fullName: "asc",
            },
        })

        const result = {
            Candidates: candidates,
            ..._paginate,
        }

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getCandidates")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidates"
        )
    }
}

/*
 * get Candidate By Id
 */

const getCandidateById = async (
    id: number
): Promise<helper.IResponseObject> => {
    try {
        const candidate = await prisma.candidate.findFirst({
            where: { id },
            include: {
                CandidateOther: true,
                CandidateTraining: true,
                CandidateJobPreference: true,
            },
        })
        if (!candidate)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            candidate
        )
    } catch (error) {
        log.error(error.message, "Error while getIndustries")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getIndustries"
        )
    }
}

/*
 * Create Candidate
 */
interface createCandidateParam {
    fullName: string
    birthDate: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    perm_address: string
    perm_city: string
    perm_state: string
    perm_country: string
    perm_zip: string
    curr_address: string
    curr_city: string
    curr_state: string
    curr_country: string
    curr_zip: string
    email1: string
    email2: string
    contactNo1: string
    contactNo2: string
    aadharNo: string
    isActive: boolean
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId: number
}

const createCandidate = async (
    userLoginId: number,
    param: createCandidateParam
): Promise<helper.IResponseObject> => {
    try {
        const candidate = await prisma.candidate.create({
            data: {
                fullName: param.fullName,
                dob: param.birthDate,
                gender: param.gender,
                permAddress: param.perm_address,
                permCity: param.perm_city,
                permState: param.perm_state,
                permCountry: param.perm_country,
                permZip: param.perm_zip,
                currAddress: param.curr_address,
                currCity: param.curr_city,
                currState: param.curr_state,
                currCountry: param.curr_country,
                currZip: param.curr_zip,
                email1: param.email1,
                email2: param.email2,
                contactNo1: param.contactNo1,
                contactNo2: param.contactNo2,
                aadharNo: param.aadharNo,
                candidateRawid: userLoginId, // ! wrong value
                isActive: param.isActive,
                approvedOn: moment().utc().format(),
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                approvedBy: userLoginId,
                CandidateOther: {
                    create: {
                        expYears: param.totalExpYears,
                        expMonths: param.totalExpMonths,
                        registrationStatus: param.registrationStatus,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Candidate created successfully",
            candidate
        )
    } catch (error) {
        log.error(error.message, "Error while createCandidate")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCandidate"
        )
    }
}
/*
 * Update Candidate
 */
interface updateCandidateParam {
    id: number
    fullName: string
    birthDate: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    perm_address: string
    perm_city: string
    perm_state: string
    perm_country: string
    perm_zip: string
    curr_address: string
    curr_city: string
    curr_state: string
    curr_country: string
    curr_zip: string
    email1: string
    email2: string
    contactNo1: string
    contactNo2: string
    aadharNo: string
    isActive: boolean
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId: number
}

const updateCandidateById = async (
    userLoginId: number,
    param: updateCandidateParam
): Promise<helper.IResponseObject> => {
    try {
        const candidateFound = await prisma.candidate.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!candidateFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate not found"
            )

        const candidate = await prisma.candidate.update({
            where: {
                id: candidateFound.id,
            },
            data: {
                fullName: param.fullName,
                dob: param.birthDate,
                gender: param.gender,
                permAddress: param.perm_address,
                permCity: param.perm_city,
                permState: param.perm_state,
                permCountry: param.perm_country,
                permZip: param.perm_zip,
                currAddress: param.curr_address,
                currCity: param.curr_city,
                currState: param.curr_state,
                currCountry: param.curr_country,
                currZip: param.curr_zip,
                email1: param.email1,
                email2: param.email2,
                contactNo1: param.contactNo1,
                contactNo2: param.contactNo2,
                aadharNo: param.aadharNo,
                isActive: param.isActive,
                approvedOn: moment().utc().format(),
                modifiedBy: userLoginId,
                approvedBy: userLoginId,
                CandidateOther: {
                    update: {
                        expYears: param.totalExpYears,
                        expMonths: param.totalExpMonths,
                        registrationStatus: param.registrationStatus,
                        modifiedBy: userLoginId,
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate updated successfully",
            candidate
        )
    } catch (error) {
        log.error(error.message, "Error while updateCandidateById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateById"
        )
    }
}

//* bulk Candidate
const createCandidateRaw = async (
    uploadedBy: number,
    createdById: number,
    param: Array<any>
): Promise<helper.IResponseObject> => {
    try {
        const data = param
            .map((p, i: number) => {
                try {
                    return {
                        industry: `${handleString(p["industry"])}`,
                        category: `${handleString(p["category"])}`,
                        fullName: `${handleString(p["full_name"])}`,
                        contactNo1: `${p["primary_mobile"]}`,
                        currCity: `${handleString(p["curr_city"])}`,
                        currZip: `${p["curr_pincode"]}`,
                        dob: `${handleString(p["birth_date"])}`,
                        email1: `${handleString(p["primary_email"])}`,
                        expYears: `${p["exp_years"]}`,
                        prefLocation1: `${handleString(p["pref_location_1"])}`,
                        prefLocation2: `${handleString(p["pref_location_2"])}`,
                        skill1: `${handleString(p["skill_1"])}`,
                        skill2: `${handleString(p["skill_2"])}`,
                        primaryLang: `${handleString(p["primary_lang"])}`,
                        secondaryLang: `${handleString(p["secondary_lang"])}`,
                        lastCompany: `${handleString(p["last_company"])}`,
                        designation: `${handleString(p["designation"])}`,
                        education: `${handleString(p["education"])}`,
                        createdBy: createdById,
                        modifiedBy: createdById,
                        isSystemApproved: false,
                        rowNum: i + 2,
                    }
                } catch (error) {
                    console.log(error)
                }
            })
            .map((p: any) => {
                Object.keys(p).forEach((key: string) => {
                    if (p[key] === "null") p[key] = null
                })
                return p
            })

        // fetch current active agent pricing template
        const pricingTemplate = await prisma.agentPricingTemplate.findFirst({
            where: {
                isActive: true,
            },
        })
        const response = await prisma.candidateUploadBatch.create({
            data: {
                count: data.length,
                timestamp: moment().utc().format(),
                approvedCount: 0,
                rejectedCount: 0,
                agentPricingTemplate: pricingTemplate?.id,
                createdBy: createdById,
                modifiedBy: createdById,
                uploadedBy: uploadedBy,
                CandidateRaw: {
                    createMany: {
                        data,
                    },
                },
            },
        })
        candidateBatchSystemCheck(createdById, response.id)
        const userInfo = await prisma.user.findFirst({
            select: { fullName: true },
            where: {
                UserLogin: {
                    id: uploadedBy,
                },
            },
        })
        let message = "\n"
        message += "Module: *Candidate Bulk Upload*\n"
        message += "Uploaded by: *" + userInfo?.fullName + "*\n"
        message += "\n✔Bulk upload successfully✔\n"
        message += "Batch no: *" + response.id + "*\n"
        message += "✔Total uploaded: *" + response.count + "*✔"
        telegram.sendMessage(message)
        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            `Bulk upload successfully. Total uploaded: ${response.count}`,
            response
        )
    } catch (error) {
        log.error(error.message, "Error while createCandidateRaw")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCandidateRaw"
        )
    }
}

const candidateBatchSystemCheck = async (
    userLoginId: number,
    batchId: number
) => {
    try {
        const start = performance.now()
        const rawCandidates = await prisma.candidateRaw.findMany({
            where: {
                batchId,
            },
        })

        const arrRejSum: Prisma.CandidateRejectionSummaryCreateManyInput[] = []
        const filteredCandidates = rawCandidates.map((item) => {
            // industry
            let industry: string | IRejected | null = handleNotNullString(
                item.industry,
                80
            )
            if (industry && typeof industry === "object") {
                industry = null
            }

            // category
            let category: string | IRejected | null = handleNotNullString(
                item.category,
                80
            )
            if (category && typeof category === "object") {
                arrRejSum.push({
                    columnName: "category",
                    rejectionType: "REJECT",
                    rejectedBy: "SYSTEM",
                    rejectionReason: category.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                category = null
            }

            // fullName
            let fullName: string | IRejected | null = handleNotNullString(
                item.fullName,
                200
            )
            if (fullName && typeof fullName === "object") {
                arrRejSum.push({
                    columnName: "full_name",
                    rejectionType: "REJECT",
                    rejectedBy: "SYSTEM",
                    rejectionReason: fullName.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                fullName = null
            }

            // contactNo1
            let contactNo1: number | IRejected | null = handleNotNullNumber(
                item.contactNo1,
                10,
                true
            )
            if (contactNo1 && typeof contactNo1 === "object") {
                arrRejSum.push({
                    columnName: "primary_mobile",
                    rejectionType: "REJECT",
                    rejectedBy: "SYSTEM",
                    rejectionReason: contactNo1.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                contactNo1 = null
            }

            // currCity
            let currCity: string | IRejected | null = handleNotNullString(
                item.currCity,
                45
            )
            if (currCity && typeof currCity === "object") {
                arrRejSum.push({
                    columnName: "curr_city",
                    rejectionType: "REJECT",
                    rejectedBy: "SYSTEM",
                    rejectionReason: currCity.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                currCity = null
            }

            // currZip
            let currZip: number | IRejected | null = handleNumber(
                item.currZip,
                6,
                true
            )
            if (currZip && typeof currZip === "object") {
                arrRejSum.push({
                    columnName: "curr_pincode",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: currZip.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                currZip = null
            }

            // dob
            let dob: string | IRejected | null = handleDate(item.dob)
            if (dob && typeof dob == "object") {
                arrRejSum.push({
                    columnName: "birth_date",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: dob.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                dob = null
            }

            // email1
            let email1: string | IRejected | null = handleEmail(item.email1, 80)
            if (email1 && typeof email1 === "object") {
                arrRejSum.push({
                    columnName: "primary_email",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: email1.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                email1 = null
            }

            // expYears
            let expYears: number | IRejected | null = handleNumber(
                item.expYears,
                2
            )
            if (expYears && typeof expYears == "object") {
                arrRejSum.push({
                    columnName: "exp_years",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: expYears.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                expYears = null
            }

            // prefLocation1
            let prefLocation1: string | IRejected | null = handleString(
                item.prefLocation1,
                80
            )
            if (prefLocation1 && typeof prefLocation1 == "object") {
                arrRejSum.push({
                    columnName: "pref_location_1",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: prefLocation1.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                prefLocation1 = null
            }

            // prefLocation2
            let prefLocation2: string | IRejected | null = handleString(
                item.prefLocation2,
                80
            )
            if (prefLocation2 && typeof prefLocation2 == "object") {
                arrRejSum.push({
                    columnName: "pref_location_2",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: prefLocation2.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                prefLocation2 = null
            }

            // skill1
            let skill1: string | IRejected | null = handleString(
                item.skill1,
                45
            )
            if (skill1 && typeof skill1 == "object") {
                arrRejSum.push({
                    columnName: "skill_1",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: skill1.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                skill1 = null
            }

            // skill2
            let skill2: string | IRejected | null = handleString(
                item.skill2,
                45
            )
            if (skill2 && typeof skill2 == "object") {
                arrRejSum.push({
                    columnName: "skill_2",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: skill2.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                skill2 = null
            }

            // primaryLang
            let primaryLang: string | IRejected | null = handleString(
                item.primaryLang,
                30
            )
            if (primaryLang && typeof primaryLang == "object") {
                arrRejSum.push({
                    columnName: "primary_lang",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: primaryLang.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                primaryLang = null
            }

            // secondaryLang
            let secondaryLang: string | IRejected | null = handleString(
                item.secondaryLang,
                30
            )
            if (secondaryLang && typeof secondaryLang == "object") {
                arrRejSum.push({
                    columnName: "secondary_lang",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: secondaryLang.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                secondaryLang = null
            }

            // lastCompany
            let lastCompany: string | IRejected | null = handleString(
                item.lastCompany,
                100
            )
            if (lastCompany && typeof lastCompany == "object") {
                arrRejSum.push({
                    columnName: "last_company",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: lastCompany.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                lastCompany = null
            }

            // designation
            let designation: string | IRejected | null = handleString(
                item.designation,
                80
            )
            if (designation && typeof designation == "object") {
                arrRejSum.push({
                    columnName: "designation",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: designation.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                designation = null
            }

            // education
            let education: string | IRejected | null = handleString(
                item.education,
                200
            )
            if (education && typeof education == "object") {
                arrRejSum.push({
                    columnName: "education",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: education.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                education = null
            }

            const result = {
                id: item.id,
                industry,
                category,
                fullName,
                contactNo1,
                currCity,
                currZip,
                dob,
                email1,
                expYears,
                prefLocation1,
                prefLocation2,
                skill1,
                skill2,
                primaryLang,
                secondaryLang,
                lastCompany,
                designation,
                education,
                rowNum: item.rowNum,
            }
            return result
        })
        interface x
            extends Omit<
                typeof filteredCandidates[number],
                "fullName" | "contactNo1" | "category" | "currCity"
            > {
            fullName: string
            contactNo1: number
            category: string
            currCity: string
        }

        // * remove null fullName, contactNo1, category and curr_city
        let finalData = filteredCandidates.filter<x>((item): item is x => {
            return (
                item.fullName !== null &&
                item.contactNo1 !== null &&
                item.category !== null &&
                item.currCity !== null
            )
        })
        // type p = typeof finalData[number]

        // * remove duplicate email1(primary_email) from excel
        const _duplicateExcelEmails = helper.candidate.findDuplicateFromExcel(
            finalData,
            "email1",
            "primary_email",
            false
        )
        finalData = _duplicateExcelEmails.arr
        _duplicateExcelEmails.arrIgnored.forEach((item) => {
            arrRejSum.push({
                columnName: item.column,
                candidateRawId: item.rawId,
                rejectedBy: "SYSTEM",
                rejectionReason: "DUPLICATE",
                rejectionType: "IGNORE",
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            })
        })

        // * remove duplicate contactNo1(primary_mobile) from excel
        const _duplicateExcelContactNos =
            helper.candidate.findDuplicateFromExcel(
                finalData,
                "contactNo1",
                "primary_mobile",
                true
            )
        finalData = _duplicateExcelContactNos.arr
        _duplicateExcelContactNos.arrIgnored.forEach((item) => {
            arrRejSum.push({
                columnName: item.column,
                candidateRawId: item.rawId,
                rejectedBy: "SYSTEM",
                rejectionReason: "DUPLICATE",
                rejectionType: "REJECT",
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            })
        })

        // * remove null fullName, contactNo1, categoty and curr_city
        finalData = finalData.filter(
            (item) =>
                item.fullName &&
                item.contactNo1 &&
                item.category &&
                item.currCity
        )

        const duplicateFromDB = await prisma.candidate.findMany({
            where: {
                OR: [
                    {
                        email1: {
                            in: finalData
                                .map((item) => item.email1)
                                .filter(
                                    (item): item is string => item !== null
                                ),
                        },
                    },
                    {
                        contactNo1: {
                            in: finalData
                                .map((item) => item.contactNo1)
                                .filter((item) => item)
                                .map((item) => `${item}`),
                        },
                    },
                ],
            },
            select: {
                email1: true,
                contactNo1: true,
            },
        })

        if (duplicateFromDB.length) {
            // * remove duplicate email1(primary_email) from db
            const _duplicateDbEmails = helper.candidate.findDuplicateFromDB(
                finalData,
                duplicateFromDB,
                "email1",
                "primary_email",
                false
            )
            finalData = _duplicateDbEmails.arr
            _duplicateDbEmails.arrIgnored.forEach((item) => {
                arrRejSum.push({
                    columnName: item.column,
                    candidateRawId: item.rawId,
                    rejectedBy: "SYSTEM",
                    rejectionReason: "DUPLICATE",
                    rejectionType: "IGNORE",
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
            })

            // * remove duplicate contactNo1(primary_mobile) from db
            const _duplicateDbContactNos = helper.candidate.findDuplicateFromDB(
                finalData,
                duplicateFromDB,
                "contactNo1",
                "primary_mobile",
                true
            )
            finalData = _duplicateDbContactNos.arr
            _duplicateDbContactNos.arrIgnored.forEach((item) => {
                arrRejSum.push({
                    columnName: item.column,
                    candidateRawId: item.rawId,
                    rejectedBy: "SYSTEM",
                    rejectionReason: "DUPLICATE",
                    rejectionType: "REJECT",
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
            })
        }

        const arrCandidate: Array<Prisma.CandidateCreateManyInput> = []
        // const arrWorkExp

        finalData.forEach((item) => {
            arrCandidate.push({
                fullName: item.fullName,
                dob: item.dob,
                contactNo1: item.contactNo1.toString(),
                currCity: item.currCity,
                currZip: item.currZip ? item.currZip.toString() : null,
                email1: item.email1,
                skill1: item.skill1,
                skill2: item.skill2,
                preferLocation1: item.prefLocation1,
                preferLocation2: item.prefLocation2,
                expYears: item.expYears,
                status: "SYSTEM_VERIFIED",
                candidateRawid: item.id,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            })
        })

        const arrRejectedRawId: number[] = arrRejSum
            .filter((item) => item.rejectionType === "REJECT")
            .map((item) => item.candidateRawId)
        const rejectedCount = [...new Set(arrRejectedRawId)].length
        const isAllRejected = rawCandidates.length === rejectedCount

        await prisma.$transaction([
            // Create Candidate versioning
            prisma.candidate.createMany({
                data: arrCandidate,
            }),

            // Update CandidateRaw for system approved fields
            prisma.candidateRaw.updateMany({
                where: {
                    id: {
                        notIn: arrRejectedRawId,
                    },
                },
                data: {
                    isSystemApproved: true,
                    modifiedBy: userLoginId,
                },
            }),
            // Create candidate rejection summary
            prisma.candidateRejectionSummary.createMany({
                data: arrRejSum,
            }),
            //
            prisma.candidateUploadBatch.update({
                where: {
                    id: batchId,
                },
                data: {
                    status: isAllRejected ? "PROCESSED" : "IN_PROGRESS",
                    rejectedCount: {
                        increment: rejectedCount,
                    },
                    paymentAmount: isAllRejected ? 0 : undefined,
                    modifiedBy: userLoginId,
                },
            }),
        ])

        const end = performance.now()
        console.log(
            `System check done for batchNo: ${batchId} within ${
                (end - start) / 1000
            }s`
        )
    } catch (error) {
        log.error(error.message, "Error while candidateBatchSystemCheck")
    }
}

/*
 * create Candidate Traning certificate
 */
interface createCandidateTrainingCertParam {
    type: "TRAINING" | "CERTIFICATE" | "OTHER"
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: any
}

const addCandidateTrainingCert = async (
    userLoginId: number,
    param: createCandidateTrainingCertParam
): Promise<helper.IResponseObject> => {
    try {
        const candidateTraining = await prisma.candidateTraining.create({
            data: {
                title: param.title,
                type: param.type,
                issueDate: param.issueDate,
                issuedBy: param.issuedBy,
                description: param.description,
                CandidateId: {
                    connect: {
                        id: param.candidate,
                    },
                },
                SkillId: {
                    connectOrCreate: {
                        where: {
                            id: param.skillId,
                        },
                        create: {
                            title: param.skillId,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    },
                },
                CreatedBy: { connect: { id: userLoginId } },
                ModifiedBy: { connect: { id: userLoginId } },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Candidate training/certificare created successfully",
            candidateTraining
        )
    } catch (error) {
        log.error(error.message, "Error while addCandidateTrainingCert")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while addCandidateTrainingCert"
        )
    }
}
/*
 * get Candidate Traning certificate By Id
 */
const getCandidateTrainingCertById = async (
    id: number,
    certId: number
): Promise<helper.IResponseObject> => {
    try {
        const candidateTraining = await prisma.candidateTraining.findFirst({
            where: {
                id: certId,
                candidateId: id,
            },
            include: {
                SkillId: true,
            },
        })

        if (!candidateTraining)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate training/certificate not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            candidateTraining
        )
    } catch (error) {
        log.error(error.message, "Error while getCandidateTrainingCertById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateTrainingCertById"
        )
    }
}

/*
 * update Candidate Traning certificate By Id
 */
interface updateCandidateTrainingCertParam {
    id: number
    type: "TRAINING" | "CERTIFICATE" | "OTHER"
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: any
}
const updateCandidateTrainingCertById = async (
    userLoginId: number,
    param: updateCandidateTrainingCertParam
): Promise<helper.IResponseObject> => {
    try {
        const candidateTrainingFound = await prisma.candidateTraining.findFirst(
            {
                where: {
                    id: param.id,
                },
            }
        )
        if (!candidateTrainingFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate training/certificate not found"
            )

        const candidateTraining = await prisma.candidateTraining.update({
            where: {
                id: param.id,
            },
            data: {
                title: param.title,
                type: param.type,
                issueDate: param.issueDate,
                issuedBy: param.issuedBy,
                description: param.description,
                SkillId: {
                    connectOrCreate: {
                        where: {
                            id: param.skillId,
                        },
                        create: {
                            title: param.skillId,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    },
                },
                ModifiedBy: {
                    connect: {
                        id: userLoginId,
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate training/certificate updated successfully",
            candidateTraining
        )
    } catch (error) {
        log.error(error.message, "Error while updateCandidateTrainingCertById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateTrainingCertById"
        )
    }
}

/*
 * remove Candidate Traning certificate By Id
 */
interface removeCandidateTrainingCertParam {
    id: number
}
const removeCandidateTrainingCert = async (
    param: removeCandidateTrainingCertParam
): Promise<helper.IResponseObject> => {
    try {
        const deletedRow = await prisma.candidateTraining.delete({
            where: {
                id: param.id,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate training/certificate deleted successfully",
            deletedRow
        )
    } catch (error) {
        log.error(error.message, "Error while removeCandidateTrainingCert")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while removeCandidateTrainingCert"
        )
    }
}

/*
 * get Candidate workHistory By Id
 */
const getCandidateWorkHistoryById = async (
    id: number,
    workId: number
): Promise<helper.IResponseObject> => {
    try {
        const candidateWorkHistory =
            await prisma.candidateWorkHistory.findFirst({
                where: {
                    id: workId,
                    candidateId: id,
                },
            })
        if (!candidateWorkHistory)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate work history not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            candidateWorkHistory
        )
    } catch (error) {
        log.error(error.message, "Error while getCandidateWorkHistoryById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateWorkHistoryById"
        )
    }
}

/*
 * create Candidate workHistory By Id
 */
interface createCandidateWorkHistoryParam {
    startDate: Date
    endDate: Date
    description: string
    companyId: number
    skillId: any
    workHistoryId: any
    candidate: number
}

const addCandidateWorkHistory = async (
    userLoginId: number,
    param: createCandidateWorkHistoryParam
): Promise<helper.IResponseObject> => {
    try {
        let skillsSetArray = []
        const skills: number[] = []
        const newSkills: string[] = []

        skillsSetArray = param.skillId
        skillsSetArray.forEach((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })

        await prisma.skill.createMany({
            data: newSkills.map((x) => ({
                title: x,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            })),
            skipDuplicates: true,
        })

        const skillsCreated = await prisma.skill.findMany({
            where: {
                title: {
                    in: newSkills,
                },
            },
        })

        const allSkillsIds = [...skills, ...skillsCreated.map((x) => x.id)]

        const candidateWorkHistory = await prisma.candidateWorkHistory.create({
            data: {
                startDate: param.startDate,
                endDate: param.endDate,
                description: param.description,
                candidateId: param.candidate,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Candidate work history created successfully",
            candidateWorkHistory
        )
    } catch (error) {
        log.error(error.message, "Error while addCandidateWorkHistory")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while addCandidateWorkHistory"
        )
    }
}
/*
 * update Candidate workHistory By Id
 */
interface updateCandidateWorkHistoryParam {
    id: number
    startDate: Date
    endDate: Date
    description: string
    candidate: number
    companyId: number
    skillId: any
}

const updateCandidateWorkHistoryById = async (
    userLoginId: number,
    param: updateCandidateWorkHistoryParam
): Promise<helper.IResponseObject> => {
    try {
        const candidateWorkHistoryFound =
            await prisma.candidateWorkHistory.findFirst({
                where: { id: param.id },
            })
        if (!candidateWorkHistoryFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate work history not found"
            )

        let skillsSetArray = []
        const skills: number[] = []
        const newSkills: string[] = []

        skillsSetArray = param.skillId
        skillsSetArray.forEach((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })

        await prisma.skill.createMany({
            data: newSkills.map((x) => ({
                title: x,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            })),
            skipDuplicates: true,
        })

        const skillsCreated = await prisma.skill.findMany({
            where: {
                title: {
                    in: newSkills,
                },
            },
        })

        const allSkillsIds = [...skills, ...skillsCreated.map((x) => x.id)]

        const updateCWH = prisma.candidateWorkHistory.update({
            where: {
                id: param.id,
            },
            data: {
                startDate: param.startDate,
                endDate: param.endDate,
                description: param.description,
                modifiedBy: userLoginId,
            },
        })

        const [candidateWorkHistory] = await prisma.$transaction([updateCWH])

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate work history updated successfully",
            candidateWorkHistory
        )
    } catch (error) {
        log.error(error.message, "Error while updateCandidateWorkHistoryById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateWorkHistoryById"
        )
    }
}

/*
 * remove Candidate workHistory By Id
 */
interface removeCandidateWorkHistoryParam {
    id: number
}
const removeCandidateWorkHistory = async (
    param: removeCandidateWorkHistoryParam
): Promise<helper.IResponseObject> => {
    try {
        const deleteCWH = prisma.candidateWorkHistory.delete({
            where: {
                id: param.id,
            },
        })

        await prisma.$transaction([deleteCWH])

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Candidate work history deleted successfully"
        )
    } catch (error) {
        log.error(error.message, "Error while removeCandidateWorkHistory")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while removeCandidateWorkHistory"
        )
    }
}
/*
 * get Candidate workHistories
 */
const getCandidatesWorkHistory = async (
    id: number
): Promise<helper.IResponseObject> => {
    try {
        const candidatesWorkHistories =
            await prisma.candidateWorkHistory.findMany({
                where: {
                    candidateId: id,
                },
            })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            candidatesWorkHistories
        )
    } catch (error) {
        log.error(error.message, "Error while getCandidatesWorkHistory")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidatesWorkHistory"
        )
    }
}

/*
 * get Candidate Traning Certificate
 */

const getCandidateTrainingCerts = async (
    id: number
): Promise<helper.IResponseObject> => {
    try {
        const candidateTrainings = await prisma.candidateTraining.findMany({
            where: {
                candidateId: id,
            },
            include: {
                SkillId: true,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            candidateTrainings
        )
    } catch (error) {
        log.error(error.message, "Error while getCandidateTrainingCerts")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCandidateTrainingCerts"
        )
    }
}

const Candidate = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidateById,
    addCandidateTrainingCert,
    updateCandidateTrainingCertById,
    removeCandidateTrainingCert,
    addCandidateWorkHistory,
    updateCandidateWorkHistoryById,
    removeCandidateWorkHistory,
    getCandidatesWorkHistory,
    getCandidateTrainingCerts,
    getCandidateTrainingCertById,
    getCandidateWorkHistoryById,
    createCandidateRaw,
}

export { Candidate }
