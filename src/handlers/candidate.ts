import { number, string } from "joi"
import { customerDB, ormCustomer } from "../sequelize"
import { log } from "../helper"
import { Model } from "sequelize"

const getCandidates = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const candidates = await customerDB.Candidate.findAll({
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
        //console.log(err)
        throw err
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
            {
                model: customerDB.CandidateWorkHistory,
                include: [{ model: customerDB.Company }],
            },
        ],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateById")
        //console.log(err)
        throw err
    })
    return candidate
}

// Delete All Candidate

const deleteAllCandiate = async() => {
    let transaction = await ormCustomer.transaction()
    try {
        await ormCustomer.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true }); //<---- Do not check referential constraints

        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.truncate({
            // cascade: true,
            // truncate: true,
            force: true,
            transaction
        });

        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.truncate({
            // cascade: true,
            // truncate: true,
            force: true,
            transaction,       
        })

        console.log(
           deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy
        )
        // const deleteCandiateCertificate =await customerDB.CandidateCertificate.destroy({
        //     truncate:true,
        //     cascade: true,
        //     transaction
        // })

        // const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.destroy({
        //     truncate:true,
        //     cascade: true,
        //     transaction
        // })

        // const deleteCandiateInfo = await customerDB.Candidate.destroy({
        //     cascade: true,
        //     transaction
        // })
        await ormCustomer.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true }); //<---- Do not check referential constraints

        await transaction.commit()
        return Object.assign({ 
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            // deleteCandiateOtherDetails,
            // deleteCandiateCertificate,
            // deleteCandiateInfo
        })
    } catch(err){
        await transaction.rollback()
        log.error(err, "Error while deleteCandiate")
        //console.log(err)
        throw err
    }
}

// Delete Candiate By Id
const deleteCandiateById = async (id: number) => {
    let transaction = await ormCustomer.transaction()
    try {
        const getCandiateDetails = await customerDB.Candidate.findOne({
            where:{
                id:id
            },
            transaction
        })
        let candidateId = getCandiateDetails?.id
        const getCandidatesWorkHistory = await customerDB.CandidateWorkHistory.findAll({
            where:{
                candidateId:candidateId 
            },
            transaction
        })
        let getCandidatesWorkHistoryArray = getCandidatesWorkHistory.map((item) => {
                    return item.id
        })
        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.destroy({
            where:{
                //@ts-ignore
                workHistoryId:getCandidatesWorkHistoryArray
            },
            transaction
        })
        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.destroy({
            where:{
                candidateId:candidateId 
            },
            transaction
        })
        const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.destroy({
            where:{
                candidateId:candidateId
            },
            transaction
        })
        const deleteCandiateCertificate = await customerDB.CandidateCertificate.destroy({
            where:{
                candidateId:candidateId
            },
            transaction
        })
        const deleteCandiateInfo = await customerDB.Candidate.destroy({
            where:{
                id:id
            },
            transaction
        })
        await transaction.commit()
        return Object.assign({ 
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            deleteCandiateOtherDetails,
            deleteCandiateCertificate,
            deleteCandiateInfo
        })
    } catch(err){
        await transaction.rollback()
        log.error(err, "Error while deleteCandiateById")
        //console.log(err)
        throw err
    }
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
        log.error(err, "Error while createCandidate")
        //console.log(err)
        throw err
    }
}

interface updateCandidateParam {
    id: number
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

const updateCandidateById = async (param: updateCandidateParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidateInfo = await customerDB.Candidate.findOne({
            where: { id: param.id },
        })
        let updateCandidate = null
        if (candidateInfo) {
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
        // console.log(err)
        log.error(err, "Error while updateCandidateById")
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
    let transaction = await ormCustomer.transaction()
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
        log.error(err, "Error while bluckCreateCandidate")
        //console.log(err)
        throw err
    }
}
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
    let getskillId:any;
    if(param.skillId == undefined || param.skillId == null){
        getskillId = null;
    } else{
        console.log("go to else condition")
        if (typeof param.skillId !== "number" ) {
            // @ts-ignore
            let newSkillset = await customerDB.SkillSet.create({
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
        //console.log(err);
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
    candidate: number
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
        candidateCertificate.candidateId = param.candidate
        candidateCertificate.skillId = param.skillId
        updateCandidateCertificate = await candidateCertificate
            .save()
            .catch((err: any) => {
                log.error(err, "Error while updateCandidateTrainingCertById")
                //console.log(err)
                throw err
            })
        return updateCandidateCertificate
    }
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
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateTrainingCert")
        //console.log(err)
        throw err
    })
    return deletedRows
}

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
    let transaction = await ormCustomer.transaction()
    try {
        let skillsSetArray = []
        let skills: any = []
        let newSkills: any = []

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
        let getSkillId = skillSet.map((item) => {
            return {
                skillId: item.id,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        let skillsArrayObject = skills.map((item: any) => {
            return {
                skillId: item,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        let workHistorySkill = [...skillsArrayObject, ...getSkillId]

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
        //console.log(err)
        throw err
    }
}

interface updateCandidateWorkHistoryParam {
    id: number
    startDate: Date
    endDate: Date
    description: string
    candidate: number
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
        candidateWorkHistory.candidateId = param.candidate
        candidateWorkHistory.companyId = param.companyId
        updateCandidateWcandidateWorkHistory = await candidateWorkHistory
            .save()
            .catch((err: any) => {
                log.error(err, "Error while updateCandidateWorkHistoryById")
                //console.log(err)
                throw err
            })
        return updateCandidateWcandidateWorkHistory
    }
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
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        //console.log(err);
        throw err
    })
    return deletedRows
}

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
        //console.log(err)
        throw err
    })
    return candidatesWorkHistory
}

const getCandidateTrainingCert = async (id: number) => {
    const candidatesWorkHistory = await customerDB.CandidateCertificate.findAll(
        {
            include: [{ model: customerDB.SkillSet }],
            where: {
                candidateId: id,
            },
        }
    ).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        //(err)
        throw err
    })
    return candidatesWorkHistory
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
}

export { Candidate }
