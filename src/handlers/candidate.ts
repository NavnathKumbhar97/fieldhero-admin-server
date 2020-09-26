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

const Candidate = {
    getCandidates
}

export { Candidate }