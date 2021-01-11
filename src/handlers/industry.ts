import { customerDB } from "../sequelize"
import { log } from "../helper"
/*
 * get All Industries Details
 */
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
    }).catch((err: any) => {
        log.error(err, "Error while getIndustries")
        //console.log(err)
        throw err
    })
    return industries
}
/*
 * get All Industry Details By Id
 */
const getIndustryById = async (id: number) => {
    const industry = await customerDB.Industry.findOne({
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getIndustryById")
        //console.log(err)
        throw err
    })
    return industry
}

/*
 * Create Industry Details
 */
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
            log.error(err, "Error while createIndustry")
            //console.log(err)
            throw err
        })
        return industry
    }
}

/*
 * Update Industry Details
 */
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
            log.error(err, "Error while updateIndustryById")
            //console.log(err)
            throw err
        })
    return industry
}
/*
 * Delete Industry Details
 */
const deleteIndustryById = async (id:number) => {
    const industry = await customerDB.Industry.findOne({
        where:{
            id:id
        }
    })
    let deleteIndustry = null
    if(industry) {
        industry.isActive = false;
        deleteIndustry = await industry.save()
        .catch((err:any)=>{
            log.error(err, "Error while deleteIndustryById")
            //console.log(err)
            throw err
        })
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
