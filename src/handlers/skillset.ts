import { customerDB } from "../sequelize"

const getSkillSets = async () => {
    const skillSets = await customerDB.SkillSet.findAll()
    .catch((ex: any) => {
        throw ex
    })
    return skillSets
}
const getSkillSetById = async (id:number) => {
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
    let createdSkillSet = await customerDB.SkillSet.create({
        title:param.title,
        description:param.description,
        isActive:param.isActive,
    }).catch((ex) => {
        throw ex
    })
    return createdSkillSet
}

interface updateSkillSetParam {
    id:number
    title: string
    description: string
    isActive: boolean
}

const updateSkillSetById = async (param:updateSkillSetParam) => {
    try {
        let skill = await customerDB.SkillSet.findOne({ 
            where: 
            { id:param.id }
        })
        // @ts-ignore: Object is possibly 'null'.
        skill.title = param.title // @ts-ignore: Object is possibly 'null'.
        skill.description = param.description // @ts-ignore: Object is possibly 'null'.
        skill.isActive = param.isActive // @ts-ignore: Object is possibly 'null'.
        let updatedSkill = await skill.save()
        return updatedSkill
    } catch (error) {
        throw error
    }
}

const SkillSet = {
    getSkillSets,
    getSkillSetById,
    createSkillSet,
    updateSkillSetById
}

export { SkillSet }