import { number } from "joi"
import { customerDB } from "../sequelize"

const getSkillSets = async (all:any) => {
    let whereCondition = {}
    if(all == '*') {
        whereCondition = [0,1]
    } else {
        whereCondition = 1
    }
    const skillSets = await customerDB.SkillSet.findAll({
        where:{
            isActive: whereCondition
        }
    }).catch((ex: any) => {
        throw ex
    })
    return skillSets
}
const getSkillSetById = async (id: number) => {
    const skillSet = await customerDB.SkillSet.findOne({
        where: {
            id,
        },
    }).catch((ex) => {
        throw ex
    })
    return skillSet
}

interface createSkillSetParam {
    title: string
    description: string
    isActive: boolean
}

const createSkillSet = async (param: createSkillSetParam) => {
    const findSkillSet = await customerDB.SkillSet.findOne({
        where:{
            title:param.title
        }
    })
    if(findSkillSet){
        return null;
    } else{
        const createdSkillSet = await customerDB.SkillSet.create({
            title: param.title,
            description: param.description,
            isActive: param.isActive,
        }).catch((ex) => {
            throw ex
        })
        return createdSkillSet
    }
}

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
        updatedSkill = await skill.save()
    }
    return updatedSkill
}

const deleteSkillSetById = async (id:number) => {
    const skillSet = await customerDB.SkillSet.findOne({
        where:{
            id
        }
    })
    let deleteSkillSet = null
    if(skillSet) {
        skillSet.isActive = false;
        deleteSkillSet = await skillSet.save()
    }
    return deleteSkillSet
}


const SkillSet = {
    getSkillSets,
    getSkillSetById,
    createSkillSet,
    updateSkillSetById,
    deleteSkillSetById
}

export { SkillSet }
