import { Prisma } from "@prisma/client"
import moment from "moment"
import paginate from "jw-paginate"
// local imports
import prisma from "../prisma"
import * as helper from "../helper"
import { log, httpStatus } from "../helper"

const {
    handleString,
    handleNotNullString,
    handleNotNullNumber,
    handleNumber,
    handleDate,
    handleGender,
    handleEmail,
    handleAadhar,
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
    userLoginId: number,
    param: Array<any>
): Promise<helper.IResponseObject> => {
    try {
        const data = param
            .map((p, i: number) => ({
                industry: `${handleString(p["industry"])}`,
                category: `${handleString(p["category"])}`,
                fullName: `${handleString(p["full_name"])}`,
                contactNo1: `${p["primary_mobile"]}`,
                currAddress: `${handleString(p["curr_address"])}`,
                currCity: `${handleString(p["curr_city"])}`,
                currState: `${handleString(p["curr_state"])}`,
                currCountry: "India",
                currZip: `${p["curr_pincode"]}`,
                dob: `${handleString(p["birth_date"])}`,
                gender: `${handleString(p["gender"])}`,
                permAddress: `${handleString(p["perm_address"])}`,
                permCity: `${handleString(p["perm_city"])}`,
                permState: `${handleString(p["perm_state"])}`,
                permCountry: "India",
                permZip: `${p["perm_pincode"]}`,
                email1: `${handleString(p["primary_email"])}`,
                // email2: `${handleString(p["secondary_email"])}`,
                contactNo2: `${p["secondary_mobile"]}`,
                aadharNo: `${p["aadhar_no"]}`,
                panNo: `${handleString(p["pan_no"])}`,
                dlNo: `${handleString(p["driving_licence_no"])}`,
                expYears: `${p["exp_years"]}`,
                expMonths: `${p["exp_months"]}`,
                prefLocation1: `${handleString(p["pref_location_1"])}`,
                prefLocation2: `${handleString(p["pref_location_2"])}`,
                // prefLocation3: `${handleString(p["pref_location_3"])}`,
                skill1: `${handleString(p["skill_1"])}`,
                skill2: `${handleString(p["skill_2"])}`,
                primaryLang: `${handleString(p["primary_lang"])}`,
                secondaryLang: `${handleString(p["secondary_lang"])}`,
                // thirdLang: `${handleString(p["third_lang"])}`,
                lastCompany: `${handleString(p["last_company"])}`,
                designation: `${handleString(p["designation"])}`,
                startDate: `${handleString(p["start_date"])}`,
                endDate: `${handleString(p["end_date"])}`,
                jobDescription: `${handleString(p["job_description"])}`,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                isSystemApproved: false,
                rowNum: i + 2,
            }))
            .map((p: any) => {
                Object.keys(p).forEach((key: string) => {
                    if (p[key] === "null") p[key] = null
                })
                return p
            })
        const response = await prisma.candidateUploadBatch.create({
            data: {
                count: data.length,
                timestamp: moment().utc().format(),
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                CandidateRaw: {
                    createMany: {
                        data,
                    },
                },
            },
        })
        candidateBatchSystemCheck(userLoginId, response.id)
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
        const rawCandidates = await prisma.candidateRaw.findMany({
            where: {
                batchId,
            },
        })

        const arrRejSum: Prisma.CandidateRejectionSummaryCreateManyInput[] = []
        const filteredCandidates = rawCandidates.map((item) => {
            // industry
            let industry: any = handleNotNullString(item.industry, 80)
            if (industry && typeof industry === "object") {
                industry = "Other"
            }

            // category
            let category: any = handleNotNullString(item.category, 80)
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
            let fullName: any = handleNotNullString(item.fullName, 200)
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
            let contactNo1: any = handleNotNullNumber(item.contactNo1, 45)
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

            // currAddress
            let currAddress: any = handleString(item.currAddress, 500)
            if (currAddress && typeof currAddress === "object") {
                arrRejSum.push({
                    columnName: "curr_address",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: currAddress.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                currAddress = null
            }

            // currCity
            let currCity: any = handleNotNullString(item.currCity, 45)
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

            // currState
            let currState: any = handleString(item.currState, 45)
            if (currState && typeof currState === "object") {
                arrRejSum.push({
                    columnName: "curr_state",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: currState.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                currState = null
            }

            // currCountry
            const currCountry = item.currCountry

            // currZip
            let currZip: any = handleNumber(item.currZip, 10)
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
            let dob: any = handleDate(item.dob)
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

            // gender
            let gender: any = handleGender(item.gender)
            if (gender && typeof gender === "object") {
                arrRejSum.push({
                    columnName: "gender",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: gender.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                gender = null
            }

            // permAddress
            let permAddress: any = handleString(item.permAddress, 500)
            if (permAddress && typeof permAddress === "object") {
                arrRejSum.push({
                    columnName: "perm_address",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: permAddress.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                permAddress = null
            }

            // permCity
            let permCity: any = handleString(item.permCity, 45)
            if (permCity && typeof permCity === "object") {
                arrRejSum.push({
                    columnName: "perm_city",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: permCity.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                permCity = null
            }

            // permState
            let permState: any = handleString(item.permState, 45)
            if (permState && typeof permState === "object") {
                arrRejSum.push({
                    columnName: "perm_state",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: permState.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                permState = null
            }

            // permCountry
            const permCountry = item.permCountry

            // permZip
            let permZip: any = handleNumber(item.permZip, 10)
            if (permZip && typeof permZip === "object") {
                arrRejSum.push({
                    columnName: "perm_pincode",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: permZip.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                permZip = null
            }

            // email1
            let email1: any = handleEmail(item.email1, 80)
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

            // email2
            // let email2: any = handleEmail(item.email2, 80)
            // if (email2 && typeof email2 === "object") {
            //     arrRejSum.push({
            //         columnName: "secondary_email",
            //         rejectionType: "IGNORE",
            //         rejectedBy: "SYSTEM",
            //         rejectionReason: email2.error,
            //         candidateRawId: item.id,
            //         createdBy: userLoginId,
            //         modifiedBy: userLoginId,
            //     })
            //     email2 = null
            // }

            // contactNo2
            let contactNo2: any = handleNumber(item.contactNo2, 45)
            if (contactNo2 && typeof contactNo2 === "object") {
                arrRejSum.push({
                    columnName: "secondary_mobile",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: contactNo2.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                contactNo2 = null
            }

            // aadharNo
            let aadharNo: any = handleAadhar(item.aadharNo)
            if (aadharNo && typeof aadharNo === "object") {
                arrRejSum.push({
                    columnName: "aadhar_no",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: aadharNo.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                aadharNo = null
            }

            // panNo
            let panNo: any = handleString(item.panNo, 12)
            if (panNo && typeof panNo === "object") {
                arrRejSum.push({
                    columnName: "pan_no",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: panNo.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                panNo = null
            }

            // dlNo
            let dlNo: any = handleString(item.dlNo, 20)
            if (dlNo && typeof dlNo === "object") {
                arrRejSum.push({
                    columnName: "driving_licence_no",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: dlNo.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                dlNo = null
            }

            // expYears
            let expYears: any = handleNumber(item.expYears)
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

            // expMonths
            let expMonths: any = handleNumber(item.expMonths)
            if (expMonths && typeof expMonths == "object") {
                arrRejSum.push({
                    columnName: "exp_months",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: expMonths.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                expMonths = null
            }

            // prefLocation1
            let prefLocation1: any = handleString(item.prefLocation1, 80)
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
            let prefLocation2: any = handleString(item.prefLocation2, 80)
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

            // prefLocation3
            // let prefLocation3: any = handleString(item.prefLocation3, 80)
            // if (prefLocation3 && typeof prefLocation3 == "object") {
            //     arrRejSum.push({
            //         columnName: "pref_location_3",
            //         rejectionType: "IGNORE",
            //         rejectedBy: "SYSTEM",
            //         rejectionReason: prefLocation3.error,
            //         candidateRawId: item.id,
            //         createdBy: userLoginId,
            //         modifiedBy: userLoginId,
            //     })
            //     prefLocation3 = null
            // }

            // skill1
            let skill1: any = handleString(item.skill1, 45)
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
            let skill2: any = handleString(item.skill2, 45)
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
            let primaryLang: any = handleString(item.primaryLang, 30)
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
            let secondaryLang: any = handleString(item.secondaryLang, 30)
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

            // thirdLang
            // let thirdLang: any = handleString(item.thirdLang, 30)
            // if (thirdLang && typeof thirdLang == "object") {
            //     arrRejSum.push({
            //         columnName: "third_lang",
            //         rejectionType: "IGNORE",
            //         rejectedBy: "SYSTEM",
            //         rejectionReason: thirdLang.error,
            //         candidateRawId: item.id,
            //         createdBy: userLoginId,
            //         modifiedBy: userLoginId,
            //     })
            //     thirdLang = null
            // }

            // lastCompany
            let lastCompany: any = handleString(item.lastCompany, 100)
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
            let designation: any = handleString(item.designation, 80)
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

            // startDate
            let startDate: any = handleDate(item.startDate)
            if (startDate && typeof startDate == "object") {
                arrRejSum.push({
                    columnName: "start_date",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: startDate.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                startDate = null
            }

            // endDate
            let endDate: any = handleDate(item.endDate)
            if (endDate && typeof endDate == "object") {
                arrRejSum.push({
                    columnName: "end_date",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: endDate.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                endDate = null
            }

            // jobDescription
            let jobDescription: any = handleString(item.jobDescription, 200)
            if (jobDescription && typeof jobDescription == "object") {
                arrRejSum.push({
                    columnName: "job_description",
                    rejectionType: "IGNORE",
                    rejectedBy: "SYSTEM",
                    rejectionReason: jobDescription.error,
                    candidateRawId: item.id,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                })
                jobDescription = null
            }

            return {
                id: item.id,
                industry,
                category,
                fullName,
                contactNo1,
                currAddress,
                currCity,
                currState,
                currCountry,
                currZip,
                dob,
                gender,
                permAddress,
                permCity,
                permState,
                permCountry,
                permZip,
                email1,
                // email2,
                contactNo2,
                aadharNo,
                panNo,
                dlNo,
                expYears,
                expMonths,
                prefLocation1,
                prefLocation2,
                // prefLocation3,
                skill1,
                skill2,
                primaryLang,
                secondaryLang,
                // thirdLang,
                lastCompany,
                designation,
                startDate,
                endDate,
                jobDescription,
                rowNum: item.rowNum,
            }
        })

        // * remove null fullName, contactNo1, category and curr_city
        let finalData = filteredCandidates.filter(
            (item) =>
                item.fullName &&
                item.contactNo1 &&
                item.category &&
                item.currCity
        )

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

        // * remove duplicate aadharNo(aadhar_no) from excel
        const _duplicateExcelAadharNos = helper.candidate.findDuplicateFromExcel(
            finalData,
            "aadharNo",
            "aadhar_no",
            false
        )
        finalData = _duplicateExcelAadharNos.arr
        _duplicateExcelAadharNos.arrIgnored.forEach((item) => {
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

        // * remove duplicate panNo(pan_no) from excel
        const _duplicateExcelPanNos = helper.candidate.findDuplicateFromExcel(
            finalData,
            "panNo",
            "pan_no",
            false
        )
        finalData = _duplicateExcelPanNos.arr
        _duplicateExcelPanNos.arrIgnored.forEach((item) => {
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

        // * remove duplicate dlNo(driving_licence_no) from excel
        const _duplicateExcelDlNos = helper.candidate.findDuplicateFromExcel(
            finalData,
            "dlNo",
            "driving_licence_no",
            false
        )
        finalData = _duplicateExcelDlNos.arr
        _duplicateExcelDlNos.arrIgnored.forEach((item) => {
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
        const _duplicateExcelContactNos = helper.candidate.findDuplicateFromExcel(
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

        const duplicateFromDB = await prisma.candidateVersioning.findMany({
            where: {
                OR: [
                    {
                        email1: {
                            in: finalData
                                .map((item) => item.email1)
                                .filter((item) => item),
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
                    {
                        aadharNo: {
                            in: finalData
                                .map((item) => item.aadharNo)
                                .filter((item) => item),
                        },
                    },
                    {
                        panNo: {
                            in: finalData
                                .map((item) => item.panNo)
                                .filter((item) => item),
                        },
                    },
                    {
                        dlNo: {
                            in: finalData
                                .map((item) => item.dlNo)
                                .filter((item) => item),
                        },
                    },
                ],
            },
            select: {
                email1: true,
                contactNo1: true,
                aadharNo: true,
                panNo: true,
                dlNo: true,
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

            // * remove duplicate aadharNo(aadhar_no) from db
            const _duplicateDbAadharNos = helper.candidate.findDuplicateFromDB(
                finalData,
                duplicateFromDB,
                "aadharNo",
                "aadhar_no",
                false
            )
            finalData = _duplicateDbAadharNos.arr
            _duplicateDbAadharNos.arrIgnored.forEach((item) => {
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

            // * remove duplicate panNo(pan_no) from db
            const _duplicateDbPanNos = helper.candidate.findDuplicateFromDB(
                finalData,
                duplicateFromDB,
                "panNo",
                "pan_no",
                false
            )
            finalData = _duplicateDbPanNos.arr
            _duplicateDbPanNos.arrIgnored.forEach((item) => {
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

            // * remove duplicate dlNo(driving_licence_no) from db
            const _duplicateDbDlNos = helper.candidate.findDuplicateFromDB(
                finalData,
                duplicateFromDB,
                "dlNo",
                "driving_licence_no",
                false
            )
            finalData = _duplicateDbDlNos.arr
            _duplicateDbDlNos.arrIgnored.forEach((item) => {
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

        const arrCandidateVersioning = finalData.map(
            (item): Prisma.CandidateVersioningCreateManyInput => {
                const {
                    id,
                    rowNum,
                    primaryLang,
                    secondaryLang,
                    // thirdLang,
                    prefLocation1,
                    prefLocation2,
                    // prefLocation3,
                    contactNo1,
                    contactNo2,
                    ...other
                } = item

                return {
                    candidateRawId: id,
                    primaryLanguage: primaryLang,
                    secondaryLanguage: secondaryLang,
                    // thirdLanguage: thirdLang,
                    preferLocation1: prefLocation1,
                    preferLocation2: prefLocation2,
                    // preferLocation3: prefLocation3,
                    contactNo1: `${contactNo1}`,
                    contactNo2: contactNo2 ? `${contactNo2}` : null,
                    version: 1,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                    ...other,
                }
            }
        )

        const arrRejectedRawId: number[] = arrRejSum
            .filter((item) => item.rejectionType === "REJECT")
            .map((item) => item.candidateRawId)

        await prisma.$transaction([
            // Create Candidate versioning
            prisma.candidateVersioning.createMany({
                data: arrCandidateVersioning,
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
                },
            }),
            // Create candidate rejection summary
            prisma.candidateRejectionSummary.createMany({
                data: arrRejSum,
            }),
        ])

        console.log(`System check done for batchNo: ${batchId}`)
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
        const candidateWorkHistory = await prisma.candidateWorkHistory.findFirst(
            {
                where: {
                    id: workId,
                    candidateId: id,
                },
                include: {
                    CompanyId: true,
                    Skill: true,
                },
            }
        )
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
                Skill: {
                    createMany: {
                        data: allSkillsIds.map((x) => ({
                            skillId: x,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        })),
                    },
                },
                candidateId: param.candidate,
                companyId: param.companyId,
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
        const candidateWorkHistoryFound = await prisma.candidateWorkHistory.findFirst(
            {
                where: { id: param.id },
            }
        )
        if (!candidateWorkHistoryFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate work history not found"
            )

        const deleteSkillsFromCWH = prisma.skillOnCandidateWorkHistory.deleteMany(
            {
                where: {
                    candidateWorkHistoryId: param.id,
                },
            }
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
                Skill: {
                    createMany: {
                        data: allSkillsIds.map((x) => ({
                            skillId: x,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        })),
                    },
                },
                companyId: param.companyId,
                modifiedBy: userLoginId,
            },
        })

        const [
            deletedSkills,
            candidateWorkHistory,
        ] = await prisma.$transaction([deleteSkillsFromCWH, updateCWH])

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
        const deleteSkills = prisma.skillOnCandidateWorkHistory.deleteMany({
            where: {
                candidateWorkHistoryId: param.id,
            },
        })
        const deleteCWH = prisma.candidateWorkHistory.delete({
            where: {
                id: param.id,
            },
        })

        await prisma.$transaction([deleteSkills, deleteCWH])

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
        const candidatesWorkHistories = await prisma.candidateWorkHistory.findMany(
            {
                where: {
                    candidateId: id,
                },
                include: {
                    CompanyId: true,
                    Skill: true,
                },
            }
        )

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
