import { title } from "process"
import { where } from "sequelize"
import { customerDB } from "../sequelize"

const getIndustries = async () => {
    const industries = await customerDB.Industry.findAll()
    .catch((ex:any) => {
        throw ex
    })
    return industries
}

const getIndustryById = async (id:number) => {
    const industry = await customerDB.Industry.findOne({
        where: {
            id,
        },
    }).catch((ex:any) => {
        throw ex
    })
    return industry
}

const createIndustry = async({
    title:String ="",
    description = "",
    isActive = true,
}) => {
    const industry = await customerDB.Industry.create(
        {
            title: title,
            description: description,
            isActive,
        },
     ).catch((err) => {
         throw err
    })
    return industry;
}

const Industry = {
    getIndustries,
    getIndustryById,
    createIndustry
}
export {
    Industry 
}