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

const Candidate = {
    getCandidates,
    getCandidateById,
    createCandidate
}

export { Candidate }