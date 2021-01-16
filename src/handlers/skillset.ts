import { customerDB } from "../sequelize"
import { log } from "../helper"
/*
 * Get All SkillSets Details
 */
const getSkillSets = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const skillSets = await customerDB.SkillSet.findAll({
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getSkillSets")
        throw err
    })
    return skillSets
}

/*
 * Get SkillSets Details By Id
 */
const getSkillSetById = async (id: number) => {
    const skillSet = await customerDB.SkillSet.findOne({
        where: {
            id,
        },
    }).catch((err) => {
        log.error(err, "Error while getSkillSetById")
        throw err
    })
    return skillSet
}
/*
 * Create SkillSets Details
 */
interface createSkillSetParam {
    title: string
    description: string
    isActive: boolean
}

const createSkillSet = async (param: createSkillSetParam) => {
    const findSkillSet = await customerDB.SkillSet.findOne({
        where: {
            title: param.title,
        },
    })
    if (findSkillSet) {
        return null
    } else {
        const createdSkillSet = await customerDB.SkillSet.create({
            title: param.title,
            description: param.description,
            isActive: param.isActive,
        }).catch((err: any) => {
            log.error(err, "Error while createSkillSet")
            throw err
        })
        return createdSkillSet
    }
}
/*
 * Update SkillSets Details
 */
interface updateSkillSetParam {
    id: number
    title: string
    description: string
    isActive: boolean
}

const updateSkillSetById = async (param: updateSkillSetParam) => {
    const skill = await customerDB.SkillSet.findOne({
        where: { id: param.id },
    })
    let updatedSkill = null
    if (skill) {
        skill.title = param.title
        skill.description = param.description
        skill.isActive = param.isActive
        updatedSkill = await skill.save().catch((err: any) => {
            log.error(err, "Error while updateSkillSetById")
            throw err
        })
        return updatedSkill
    }
}

/*
 * Deleted SkillSets Details
 */
const deleteSkillSetById = async (id: number) => {
    const skillSet = await customerDB.SkillSet.findOne({
        where: {
            id,
        },
    })
    let deleteSkillSet = null
    if (skillSet) {
        skillSet.isActive = false
        deleteSkillSet = await skillSet.save().catch((err: any) => {
            log.error(err, "Error while deleteSkillSetById")
            throw err
        })
        return deleteSkillSet
    }
}

const SkillSet = {
    getSkillSets,
    getSkillSetById,
    createSkillSet,
    updateSkillSetById,
    deleteSkillSetById,
}

export { SkillSet }
