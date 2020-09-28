import { customerDB } from "../sequelize"

const getCandidates = async () => {
    const candidates = await customerDB.Candidate.findAll({
        // include: [
        //     { model: orm.CandidateTrainingCert },
        //     { model: orm.CandidateWorkHistory },
        // ],
    }).catch((ex:any) => {
        throw ex
    })
    return candidates
}

const getCandidateById = async (id:number) => {
    const candidate = await customerDB.Candidate.findOne({
        where: {
            id,
        },
        // include: [
        //     { model: orm.CandidateTrainingCert },
        //     { model: orm.CandidateWorkHistory },
        // ],
    }).catch((ex:any) => {
        throw ex
    })
    return candidate
}

interface createCandidateParam {
    firstName: string
    middleName: string
    lastName: string
    birthDate:Date
    gender: string,
    perm_address: string,
    perm_city: string,
    perm_state: string,
    perm_country: string,
    perm_zip: string,
    curr_address: string,
    curr_city: string,
    curr_state: string,
    curr_country: string,
    curr_zip: string,
    email1: string,
    email2: string,
    contactNo1: string,
    contactNo2: string,
    aadharNo: string,
    isActive: boolean,
}

const createCandidate = async(param: createCandidateParam) => {
    const candidate = await customerDB.Candidate.create({
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
    }).catch((err) => {
        throw err
    })

    return candidate
}

interface createCandidateTrainingCertParam {
    type:string
    title:string
    issueDate:Date
    issuedBy:string
    description: string
    candidateId:number
    skillId:number
}
const addCandidateTrainingCert = async (param: createCandidateTrainingCertParam) =>{
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
    id:number
    type:string
    title:string
    issueDate:Date
    issuedBy:string
    description: string
    candidateId:number
    skillId:number
}

const updateCandidateTrainingCertById = async (param:updateCandidateTrainingCertParam) => {
    try {
        let candidateCertificate = await customerDB.CandidateCertificate.findOne({ 
            where: 
            { id:param.id }
        })
        // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.type = param.type // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.title = param.title // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.issueDate = param.issueDate // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.issuedBy = param.issuedBy // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.description = param.description // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.candidateId = param.candidateId // @ts-ignore: Object is possibly 'null'.
        candidateCertificate.skillId = param.skillId // @ts-ignore: Object is possibly 'null'.
        let updateCandidateCertificate = await candidateCertificate.save()
        return updateCandidateCertificate
    } catch (error) {
        throw error
    }
}
interface removeCandidateTrainingCertParam {
    id:number
}
const removeCandidateTrainingCert = async (param:removeCandidateTrainingCertParam) => {
    const deletedRows = await customerDB.CandidateCertificate.destroy({
        where: {
            id:param.id
        },
    }).catch((ex:any) => {
        throw ex
    })
    return deletedRows
}

interface createCandidateWorkHistoryParam {
    startDate:Date
    endDate:Date
    description: string
    candidateId:number
    companyId:number
}

const addCandidateWorkHistory = async (param:createCandidateWorkHistoryParam) =>{
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
    id:number
    startDate:Date
    endDate:Date
    description: string
    candidateId:number
    companyId:number
}

const updateCandidateWorkHistoryById = async (param:updateCandidateWorkHistoryParam) => {
    try {
        let candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne({ 
            where: 
            { id:param.id }
        })
        // @ts-ignore: Object is possibly 'null'.
        candidateWorkHistory.startDate = param.startDate // @ts-ignore: Object is possibly 'null'.
        candidateWorkHistory.endDate = param.endDate // @ts-ignore: Object is possibly 'null'.
        candidateWorkHistory.description = param.description // @ts-ignore: Object is possibly 'null'.
        candidateWorkHistory.candidateId = param.candidateId // @ts-ignore: Object is possibly 'null'.
        candidateWorkHistory.companyId = param.companyId // @ts-ignore: Object is possibly 'null'.
        let updateCandidateWcandidateWorkHistory = await candidateWorkHistory.save()
        return updateCandidateWcandidateWorkHistory
    } catch (error) {
        throw error
    }
}
interface removeCandidateWorkHistoryParam {
    id:number
}
const removeCandidateWorkHistory = async (param:removeCandidateWorkHistoryParam) =>{
    const deletedRows = await customerDB.CandidateWorkHistory.destroy({
        where: {
            id:param.id
        },
    }).catch((ex:any) => {
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
    removeCandidateWorkHistory
}

export { Candidate }