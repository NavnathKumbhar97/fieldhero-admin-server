import { where } from "sequelize"
import { customerDB } from "../sequelize"


const getIndustries = async (all:any) => {
    let whereCondition = {}
    if(all == '*') {
        whereCondition = [0,1]
    } else {
        whereCondition = 1
    }
    const industries = await customerDB.Industry.findAll({   
        where: {
            isActive: whereCondition
        }
    }).catch((ex: any) => {
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
    method:string
    title: string
    description: string
    isActive: boolean
}

const createIndustry = async (param: createIndustryParam) => {
    const findIndustry = await customerDB.Industry.findOne({
        where:{
            title:param.title
        }
    })
    if(findIndustry) {
        return null;
    } else {
        const industry = await customerDB.Industry.create({
            title: param.title,
            description: param.description,
            isActive: param.isActive,
        }).catch((err) => {
            throw err
        })
        return industry
    }
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

const deleteIndustryById = async (id:any) => {
    const industry = await customerDB.Industry.findOne({
        where:{
            id
        }
    })
    let deleteIndustry = null
    if(industry) {
        industry.isActive = false;
        deleteIndustry = await industry.save()
    }
    return deleteIndustry
}

const Industry = {
    getIndustries,
    getIndustryById,
    createIndustry,
    updateIndustryById,
    deleteIndustryById
}
export { Industry }
