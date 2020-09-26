import { title } from "process"

import { customerDB } from "../sequelize"

const getIndustries = async () => {
    const industries = await customerDB.Industry.findAll().catch((ex: any) => {
        throw ex
    })
    return industries
}

const getIndustryById = async (id: number) => {
    const industry = await customerDB.Industry.findOne({
        where: {
            id,
        },
    }).catch((ex: any) => {
        throw ex
    })
    return industry
}

interface createIndustryParam {
    title: string
    description: string
    isActive: boolean
}

const createIndustry = async (param: createIndustryParam) => {
    const industry = await customerDB.Industry.create({
        title: param.title,
        description: param.description,
        isActive: param.isActive,
    }).catch((err) => {
        throw err
    })
    return industry
}
interface updateIndustryParam {
    id:number,
    title: string
    description: string
    isActive: boolean
}
const updateIndustryById = async (param: updateIndustryParam) =>{
    const industry = await customerDB.Industry.update(
        {
            title: param.title,
            description: param.description,
            isActive: param.isActive,
        },
        {
            where:{
                id:param.id
            }           
        }
        ).catch((err) => {
        throw err
    })
    return industry
}

const Industry = {
    getIndustries,
    getIndustryById,
    createIndustry,
    updateIndustryById
}
export { Industry }
