import { customerDB } from "../sequelize"

const getSkillSets = async () => {
    const skillSets = await customerDB.SkillSet.findAll().catch((ex: any) => {
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
    const createdSkillSet = await customerDB.SkillSet.create({
        title: param.title,
        description: param.description,
        isActive: param.isActive,
    }).catch((ex) => {
        throw ex
    })
    return createdSkillSet
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

const SkillSet = {
    getSkillSets,
    getSkillSetById,
    createSkillSet,
    updateSkillSetById,
}

export { SkillSet }
