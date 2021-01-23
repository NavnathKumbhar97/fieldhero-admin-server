import { number, string } from "joi"
import * as helper from "../helper"
import { customerDB, ormCustomer } from "../sequelize"
import { log, getPagingData } from "../helper"
import { Model } from "sequelize"
import { Interface } from "readline"

/*
 * get All Get Candidates
 */

const getCandidates = async (pagination: any) => {
    let whereCondition = {}
    if (pagination.all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    let page
    let limit
    if (
        (pagination.limit == undefined && pagination.offset == undefined) ||
        pagination.limit == undefined ||
        pagination.offset == undefined
    ) {
        page = 0
        limit = 10
    } else {
        limit = parseInt(pagination.limit)
        page = parseInt(pagination.offset)
    }
    const candidates = await customerDB.Candidate.findAndCountAll({
        limit: limit,
        offset: page,
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            {
                model: customerDB.CandidateWorkHistory,
                include: [
                    {
                        model: customerDB.Company,
                        required: false,
                    },
                ],
            },
        ],
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getCandidates")
        throw err
    })
    const response = getPagingData(candidates, page, limit)

    return response
}

/*
 * get All Get Candidates By Id
 */

const getCandidateById = async (id: number) => {
    const candidate = await customerDB.Candidate.findOne({
        where: {
            id,
        },
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            {
                model: customerDB.CandidateWorkHistory,
                include: [{ model: customerDB.Company }],
            },
        ],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateById")
        throw err
    })
    return candidate
}

/*
 * Delete All Candidate truncate
 */
const deleteAllCandiate = async () => {
    const transaction = await ormCustomer.transaction()
    try {
        await ormCustomer.query("SET FOREIGN_KEY_CHECKS = 0", {
            raw: true,
            transaction,
        })
        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.truncate(
            {
                transaction,
            }
        )
        const deleteCandiateCertificate = await customerDB.CandidateCertificate.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateInfo = await customerDB.Candidate.truncate({
            transaction,
        })
        await ormCustomer.query("SET FOREIGN_KEY_CHECKS = 1", {
            raw: true,
            transaction,
        }) //<---- Do not check referential constraints

        await transaction.commit()
        return Object.assign({
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            deleteCandiateOtherDetails,
            deleteCandiateCertificate,
            deleteCandiateInfo,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while deleteCandiate")

        throw err
    }
}

/*
 * Delete All Candidate By Id
 */
const deleteCandiateById = async (id: number) => {
    const transaction = await ormCustomer.transaction()
    try {
        const getCandiateDetails = await customerDB.Candidate.findOne({
            where: {
                id: id,
            },
            transaction,
        })
        const candidateId = getCandiateDetails?.id
        const getCandidatesWorkHistory = await customerDB.CandidateWorkHistory.findAll(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const getCandidatesWorkHistoryArray = getCandidatesWorkHistory.map(
            (item) => {
                return item.id!
            }
        )
        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.destroy(
            {
                where: {
                    workHistoryId: getCandidatesWorkHistoryArray,
                },
                transaction,
            }
        )
        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateCertificate = await customerDB.CandidateCertificate.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateInfo = await customerDB.Candidate.destroy({
            where: {
                id: id,
            },
            transaction,
        })
        await transaction.commit()
        return Object.assign({
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            deleteCandiateOtherDetails,
            deleteCandiateCertificate,
            deleteCandiateInfo,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while deleteCandiateById")
        throw err
    }
}
/*
 * Create Candidate
 */
interface createCandidateParam {
    fullName: string
    firstName: string
    middleName: string
    lastName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
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

const createCandidate = async (param: createCandidateParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidate = await customerDB.Candidate.create(
            {
                fullName: param.fullName,
                firstName: param.firstName || "NULL",
                middleName: param.middleName || "NULL",
                lastName: param.lastName || "NULL",
                birthDate: param.birthDate,
                gender: param.gender,
                perm_address: param.perm_address,
                perm_city: param.perm_city,
                perm_state: param.perm_state,
                perm_country: param.perm_country,
                perm_zip: param.perm_zip,
                curr_address: param.curr_address,
                curr_city: param.curr_city,
                curr_state: param.curr_state,
                curr_country: param.curr_country,
                curr_zip: param.curr_zip,
                email1: param.email1,
                email2: param.email2,
                contactNo1: param.contactNo1,
                contactNo2: param.contactNo2,
                aadharNo: param.aadharNo,
                isActive: param.isActive,
            },
            { transaction }
        )

        const candidateother = await customerDB.CandidateOtherDetails.create(
            {
                totalExpMonths: param.totalExpMonths,
                totalExpYears: param.totalExpYears,
                registrationStatus: param.registrationStatus,
                candidateId: candidate.get("id"),
            },
            { transaction }
        )

        await transaction.commit()
        return Object.assign({ candidate, candidateother })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while createCandidate")
        throw err
    }
}
/*
 * Update Candidate
 */
interface updateCandidateParam {
    id: number
    fullName: string
    firstName: string
    middleName: string
    lastName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
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

const updateCandidateById = async (param: updateCandidateParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidateInfo = await customerDB.Candidate.findOne({
            where: { id: param.id },
        })
        let updateCandidate = null
        if (candidateInfo) {
            candidateInfo.fullName = param.fullName
            candidateInfo.firstName = param.firstName
            candidateInfo.middleName = param.middleName
            candidateInfo.lastName = param.lastName
            candidateInfo.birthDate = param.birthDate
            candidateInfo.gender = param.gender
            candidateInfo.perm_address = param.perm_address
            candidateInfo.perm_city = param.perm_city
            candidateInfo.perm_state = param.perm_state
            candidateInfo.perm_country = param.perm_country
            candidateInfo.perm_zip = param.perm_zip
            candidateInfo.curr_address = param.curr_address
            candidateInfo.curr_city = param.curr_city
            candidateInfo.curr_state = param.curr_state
            candidateInfo.curr_country = param.curr_country
            candidateInfo.curr_zip = param.curr_zip
            candidateInfo.email1 = param.email1
            candidateInfo.email2 = param.email2
            candidateInfo.contactNo1 = param.contactNo1
            candidateInfo.contactNo2 = param.contactNo2
            candidateInfo.aadharNo = param.aadharNo
            candidateInfo.isActive = param.isActive
            updateCandidate = await candidateInfo.save()
        }
        {
            transaction
        }

        const candidateOtherDetailsInfo = await customerDB.CandidateOtherDetails.findOne(
            {
                where: { candidateId: param.id },
            }
        )
        let updateCandidateOtherDetails = null
        if (candidateOtherDetailsInfo) {
            if (param.totalExpMonths)
                candidateOtherDetailsInfo.totalExpMonths = param.totalExpMonths
            if (param.totalExpYears)
                candidateOtherDetailsInfo.totalExpYears = param.totalExpYears
            candidateOtherDetailsInfo.registrationStatus =
                param.registrationStatus
            updateCandidateOtherDetails = await candidateOtherDetailsInfo.save()
        }
        {
            transaction
        }

        await transaction.commit()
        return Object.assign({ updateCandidate, updateCandidateOtherDetails })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while updateCandidateById")
        throw err
    }
}
/*
 * bulk Candidate
 */
interface bulkCreateCandidateParam {
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
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
    primary_email: string
    secondary_email: string
    primary_mobile: string
    secondary_mobile: string
    aadharNo: string
    isActive: boolean
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId: number
}

const createBulkCandidate = async (param: Array<any>) => {
    console.log(param)
    param.map((item) => {
        // fullName
        let fullName = helper.candidate.handleString(item.fullName)
        // birthdate
        let birthDate = item.birthDate ? item.birthDate.trim() : null
        birthDate = helper.parseDate(birthDate)?.format("YYYY-MM-DD")
        // gender
        let gender = item.gender ? item.gender.trim() : null
        gender = gender ? (gender as string).toLowerCase() : null
        // perm_address
        let perm_address = helper.candidate.handleString(item.perm_address)
        // perm_city
        let perm_city = helper.candidate.handleString(item.perm_city)
        // perm_state
        let perm_state = helper.candidate.handleString(item.perm_state)
        // perm_country
        let perm_country = "India"
        // perm_zip
        let perm_zip = helper.candidate.handleNumber(item.perm_pincode)
        // curr_address
        let curr_address = helper.candidate.handleString(item.curr_address)
        // curr_city
        let curr_city = helper.candidate.handleString(item.curr_city)
        // curr_state
        let curr_state = helper.candidate.handleString(item.curr_state)
        // curr_country
        let curr_country = "India"
        // curr_zip
        let curr_zip = helper.candidate.handleNumber(item.curr_pincode)
        // email1
        let email1 = helper.candidate.handleEmail(item.primary_email)
        // email2
        let email2 = helper.candidate.handleEmail(item.secondary_email)
        // contactNo1
        let contactNo1 = helper.candidate.handleNumber(item.primary_mobile)
        // contactNo2
        let contactNo2 = helper.candidate.handleNumber(item.secondary_mobile)
        // aadharNo
        let aadharNo = helper.candidate.handleAadhar(item.aadharNo)
        // isActive
        let isActive = true
        // registrationStatus
        let registrationStatus = helper.candidate.handleString(
            item.registrationStatus
        )
        // totalExpMonths
        let totalExpMonths = helper.candidate.handleNumber(item.exp_months)
        // totalExpYears
        let totalExpYears = helper.candidate.handleNumber(item.exp_years)
        return {
            fullName,
            birthDate,
            gender,
            perm_address,
            perm_city,
            perm_state,
            perm_country,
            perm_zip,
            curr_address,
            curr_city,
            curr_state,
            curr_country,
            curr_zip,
            email1,
            email2,
            contactNo1,
            contactNo2,
            aadharNo,
            isActive,
            registrationStatus,
            totalExpMonths,
            totalExpYears,
        }
    })
    // const transaction = await ormCustomer.transaction()
    // try {
    //     const candidate = await customerDB.Candidate.bulkCreate(param, {
    //         fields: [
    //             "fullName",
    //             "birthDate",
    //             "gender",
    //             "perm_address",
    //             "perm_city",
    //             "perm_state",
    //             "perm_country",
    //             "perm_zip",
    //             "curr_address",
    //             "curr_city",
    //             "curr_state",
    //             "curr_country",
    //             "curr_zip",
    //             "email1",
    //             "email2",
    //             "contactNo1",
    //             "contactNo2",
    //             "aadharNo",
    //             "isActive",
    //         ],
    //         transaction,
    //     })
    //     const arrOtherDetails = candidate.map((item, ind) => {
    //         const { totalExpMonths, totalExpYears, registrationStatus } = param[
    //             ind
    //         ]
    //         return {
    //             totalExpMonths,
    //             totalExpYears,
    //             registrationStatus,
    //             candidateId: item.id,
    //         }
    //     })
    //     const candidateother = await customerDB.CandidateOtherDetails.bulkCreate(
    //         arrOtherDetails,
    //         {
    //             fields: [
    //                 "totalExpMonths",
    //                 "totalExpYears",
    //                 "registrationStatus",
    //                 "candidateId",
    //             ],
    //             transaction,
    //         }
    //     )

    //     await transaction.commit()
    //     return Object.assign({ candidate, candidateother })
    // } catch (err: any) {
    //     await transaction.rollback()
    //     log.error(err, "Error while bluckCreateCandidate")
    //     throw err
    // }
}

/*
 * create Candidate Traning certificate
 */
interface createCandidateTrainingCertParam {
    type: string
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: any
}

const addCandidateTrainingCert = async (
    param: createCandidateTrainingCertParam
) => {
    let getskillId: any
    if (param.skillId == undefined || param.skillId == null) {
        getskillId = null
    } else {
        if (typeof param.skillId !== "number") {
            const newSkillset = await customerDB.SkillSet.create({
                title: param.skillId,
            })
            getskillId = newSkillset.id
        } else {
            getskillId = param.skillId
        }
    }
    const candidateCertificate = await customerDB.CandidateCertificate.create({
        type: param.type,
        title: param.title,
        issueDate: param.issueDate,
        issuedBy: param.issuedBy,
        description: param.description,
        candidateId: param.candidate,
        skillId: getskillId,
    }).catch((err: any) => {
        log.error(err, "Error while addCandidateTrainingCert")
        throw err
    })
    return candidateCertificate
}
/*
 * get Candidate Traning certificate By Id
 */
const getCandidateTrainingCertById = async (id: number, certId: number) => {
    const candidateCertificate = await customerDB.CandidateCertificate.findOne({
        include: [{ model: customerDB.SkillSet }],
        where: {
            id: certId,
            candidateId: id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateTrainingCertById")
        throw err
    })
    return candidateCertificate
}
/*
 * update Candidate Traning certificate By Id
 */
interface updateCandidateTrainingCertParam {
    id: number
    type: string
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: number
}

const updateCandidateTrainingCertById = async (
    param: updateCandidateTrainingCertParam
) => {
    const candidateCertificate = await customerDB.CandidateCertificate.findOne({
        where: { id: param.id },
    })
    let getskillId: any
    if (param.skillId == undefined || param.skillId == null) {
        getskillId = null
    } else {
        if (typeof param.skillId !== "number") {
            const newSkillset = await customerDB.SkillSet.create({
                title: param.skillId,
            })
            getskillId = newSkillset.id
        } else {
            getskillId = param.skillId
        }
    }
    let updateCandidateCertificate = null
    if (candidateCertificate) {
        candidateCertificate.type = param.type
        candidateCertificate.title = param.title
        candidateCertificate.issueDate = param.issueDate
        candidateCertificate.issuedBy = param.issuedBy
        candidateCertificate.description = param.description
        candidateCertificate.candidateId = param.candidate
        candidateCertificate.skillId = getskillId
        updateCandidateCertificate = await candidateCertificate
            .save()
            .catch((err: any) => {
                log.error(err, "Error while updateCandidateTrainingCertById")
                throw err
            })
        return updateCandidateCertificate
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
) => {
    const deletedRows = await customerDB.CandidateCertificate.destroy({
        where: {
            id: param.id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateTrainingCert")
        throw err
    })
    return deletedRows
}
/*
 * get Candidate workHistory By Id
 */

const getCandidateWorkHistoryById = async (id: number, workId: number) => {
    const candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne({
        where: {
            id: workId,
            candidateId: id,
        },
        include: [
            { model: customerDB.CandidateWorkHistorySkill },
            { model: customerDB.Company },
        ],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateWorkHistoryById")
        throw err
    })
    return candidateWorkHistory
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
    param: createCandidateWorkHistoryParam
) => {
    const transaction = await ormCustomer.transaction()
    try {
        let skillsSetArray = []
        const skills: any = []
        const newSkills: any = []

        skillsSetArray = param.skillId
        skillsSetArray.map((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })
        const NewskillsArrayObject = newSkills.map((item: any) => {
            return { title: item }
        })
        const skillSet = await customerDB.SkillSet.bulkCreate(
            NewskillsArrayObject,
            {
                fields: ["id", "title"],
                transaction,
            }
        )
        const candidateWorkHistory = await customerDB.CandidateWorkHistory.create(
            {
                startDate: param.startDate,
                endDate: param.endDate,
                description: param.description,
                candidateId: param.candidate,
                companyId: param.companyId,
            },
            {
                fields: [
                    "startDate",
                    "endDate",
                    "description",
                    "candidateId",
                    "companyId",
                ],
                transaction,
            }
        )
        const getSkillId = skillSet.map((item) => {
            return {
                skillId: item.id,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        const skillsArrayObject = skills.map((item: any) => {
            return {
                skillId: item,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        const workHistorySkill = [...skillsArrayObject, ...getSkillId]

        const candidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.bulkCreate(
            workHistorySkill,
            {
                fields: ["skillId", "workHistoryId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            skillSet,
            candidateWorkHistory,
            candidateWorkHistorySkill,
        })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while addCandidateWorkHistory")
        throw err
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
    param: updateCandidateWorkHistoryParam
) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne(
            {
                where: { id: param.id },
            }
        )

        const deleteCandidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.destroy(
            {
                where: {
                    workHistoryId: param.id,
                },
                transaction,
            }
        )

        let skillsSetArray = []
        const skills: any = []
        const newSkills: any = []

        skillsSetArray = param.skillId
        skillsSetArray.map((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })
        const NewskillsArrayObject = newSkills.map((item: any) => {
            return { title: item }
        })
        const skillSet = await customerDB.SkillSet.bulkCreate(
            NewskillsArrayObject,
            {
                fields: ["id", "title"],
                transaction,
            }
        )

        let updateCandidateWcandidateWorkHistory = null
        if (candidateWorkHistory) {
            candidateWorkHistory.startDate = param.startDate
            candidateWorkHistory.endDate = param.endDate
            candidateWorkHistory.description = param.description
            candidateWorkHistory.candidateId = param.candidate
            candidateWorkHistory.companyId = param.companyId
            updateCandidateWcandidateWorkHistory = await candidateWorkHistory.save()
        }
        {
            transaction
        }
        const getSkillId = skillSet.map((item) => {
            return {
                skillId: item.id,
                workHistoryId: candidateWorkHistory?.id,
            }
        })
        const skillsArrayObject = skills.map((item: any) => {
            return {
                skillId: item,
                workHistoryId: candidateWorkHistory?.id,
            }
        })
        const workHistorySkill = [...skillsArrayObject, ...getSkillId]
        const candidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.bulkCreate(
            workHistorySkill,
            {
                fields: ["skillId", "workHistoryId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            skillSet,
            updateCandidateWcandidateWorkHistory,
            candidateWorkHistorySkill,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while updateCandidateWorkHistoryById")
        throw err
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
) => {
    const deletedRows = await customerDB.CandidateWorkHistory.destroy({
        where: {
            id: param.id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        throw err
    })
    return deletedRows
}
/*
 * get Candidate workHistory By Id
 */
const getCandidatesWorkHistory = async (id: number) => {
    const candidatesWorkHistory = await customerDB.CandidateWorkHistory.findAll(
        {
            include: [
                { model: customerDB.CandidateWorkHistorySkill },
                { model: customerDB.Company },
            ],
            where: {
                candidateId: id,
            },
        }
    ).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        throw err
    })
    return candidatesWorkHistory
}

/*
 * get Candidate Traning Certificate
 */

const getCandidateTrainingCert = async (id: number) => {
    const candidatesCertificate = await customerDB.CandidateCertificate.findAll(
        {
            include: [{ model: customerDB.SkillSet }],
            where: {
                candidateId: id,
            },
        }
    ).catch((err: any) => {
        log.error(err, "Error while getCandidateTrainingCert")
        //(err)
        throw err
    })
    return candidatesCertificate
}
const Candidate = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidateById,
    deleteAllCandiate,
    deleteCandiateById,
    addCandidateTrainingCert,
    updateCandidateTrainingCertById,
    removeCandidateTrainingCert,
    addCandidateWorkHistory,
    updateCandidateWorkHistoryById,
    removeCandidateWorkHistory,
    createBulkCandidate,
    getCandidatesWorkHistory,
    getCandidateTrainingCert,
    getCandidateTrainingCertById,
    getCandidateWorkHistoryById,
}

export { Candidate }
