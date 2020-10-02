import { METHODS } from "http"
import { customerDB, ormCustomer } from "../sequelize"

const getCandidates = async () => {
    const candidates = await customerDB.Candidate.findAll({
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            { model: customerDB.CandidateWorkHistory },
        ],
    }).catch((ex: any) => {
        throw ex
    })
    return candidates
}

const getCandidateById = async (id: number) => {
    const candidate = await customerDB.Candidate.findOne({
        where: {
            id,
        },
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            { model: customerDB.CandidateWorkHistory },
        ],
    }).catch((ex: any) => {
        throw ex
    })
    return candidate
}

interface createCandidateParam {
    firstName: string
    middleName: string
    lastName: string
    birthDate: Date
    gender: string
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
                firstName: param.firstName,
                middleName: param.middleName,
                lastName: param.lastName,
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
        throw err
    }
}

interface bulkCreateCandidateParam {
    firstName: string
    middleName: string
    lastName: string
    birthDate: Date
    gender: string
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

const createBulkCandidate = async (param: Array<bulkCreateCandidateParam>) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidate = await customerDB.Candidate.bulkCreate(param, {
            fields: [
                "firstName",
                "middleName",
                "lastName",
                "birthDate",
                "gender",
                "perm_address",
                "perm_city",
                "perm_state",
                "perm_country",
                "perm_zip",
                "curr_address",
                "curr_city",
                "curr_state",
                "curr_country",
                "curr_zip",
                "email1",
                "email2",
                "contactNo1",
                "contactNo2",
                "aadharNo",
                "isActive",
            ],
            transaction,
        })

        const arrOtherDetails = candidate.map((item, ind) => {
            const { totalExpMonths, totalExpYears, registrationStatus } = param[
                ind
            ]
            return {
                totalExpMonths,
                totalExpYears,
                registrationStatus,
                candidateId: item.id,
            }
        })
        const candidateother = await customerDB.CandidateOtherDetails.bulkCreate(
            arrOtherDetails,
            {
                fields: [
                    "totalExpMonths",
                    "totalExpYears",
                    "registrationStatus",
                    "candidateId",
                ],
                transaction,
            }
        )

        await transaction.commit()
        return Object.assign({ candidate, candidateother })
    } catch (err: any) {
        await transaction.rollback()
        console.log(err)
        throw err
    }
}
interface createCandidateTrainingCertParam {
    type: string
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidateId: number
    skillId: number
}
const addCandidateTrainingCert = async (
    param: createCandidateTrainingCertParam
) => {
    const candidateCertificate = await customerDB.CandidateCertificate.create({
        type: param.type,
        title: param.title,
        issueDate: param.issueDate,
        issuedBy: param.issuedBy,
        description: param.description,
        candidateId: param.candidateId,
        skillId: param.skillId,
    }).catch((err) => {
        throw err
    })
    return candidateCertificate
}

interface updateCandidateTrainingCertParam {
    id: number
    type: string
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidateId: number
    skillId: number
}

const updateCandidateTrainingCertById = async (
    param: updateCandidateTrainingCertParam
) => {
    const candidateCertificate = await customerDB.CandidateCertificate.findOne({
        where: { id: param.id },
    })
    let updateCandidateCertificate = null
    if (candidateCertificate) {
        candidateCertificate.type = param.type
        candidateCertificate.title = param.title
        candidateCertificate.issueDate = param.issueDate
        candidateCertificate.issuedBy = param.issuedBy
        candidateCertificate.description = param.description
        candidateCertificate.candidateId = param.candidateId
        candidateCertificate.skillId = param.skillId
        updateCandidateCertificate = await candidateCertificate.save()
    }
    return updateCandidateCertificate
}
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
    }).catch((ex: any) => {
        throw ex
    })
    return deletedRows
}

interface createCandidateWorkHistoryParam {
    startDate: Date
    endDate: Date
    description: string
    candidateId: number
    companyId: number
}

const addCandidateWorkHistory = async (
    param: createCandidateWorkHistoryParam
) => {
    const candidateWorkHistory = await customerDB.CandidateWorkHistory.create({
        startDate: param.startDate,
        endDate: param.endDate,
        description: param.description,
        candidateId: param.candidateId,
        companyId: param.companyId,
    }).catch((err) => {
        throw err
    })
    return candidateWorkHistory
}

interface updateCandidateWorkHistoryParam {
    id: number
    startDate: Date
    endDate: Date
    description: string
    candidateId: number
    companyId: number
}

const updateCandidateWorkHistoryById = async (
    param: updateCandidateWorkHistoryParam
) => {
    const candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne({
        where: { id: param.id },
    })
    let updateCandidateWcandidateWorkHistory = null
    if (candidateWorkHistory) {
        candidateWorkHistory.startDate = param.startDate
        candidateWorkHistory.endDate = param.endDate
        candidateWorkHistory.description = param.description
        candidateWorkHistory.candidateId = param.candidateId
        candidateWorkHistory.companyId = param.companyId
        updateCandidateWcandidateWorkHistory = await candidateWorkHistory.save()
    }
    return updateCandidateWcandidateWorkHistory
}
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
    }).catch((ex: any) => {
        throw ex
    })
    return deletedRows
}
const Candidate = {
    getCandidates,
    getCandidateById,
    createCandidate,
    addCandidateTrainingCert,
    updateCandidateTrainingCertById,
    removeCandidateTrainingCert,
    addCandidateWorkHistory,
    updateCandidateWorkHistoryById,
    removeCandidateWorkHistory,
    createBulkCandidate,
}

export { Candidate }
