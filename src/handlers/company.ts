import { customerDB } from "../sequelize"
import { log } from "../helper"
/*
 * get All Companies Details
 */
const getCompanies = async (all:any) => {
    let whereCondition = {}
    if(all == '*') {
        whereCondition = [0,1]
    } else {
        whereCondition = 1
    }
    const companies = await customerDB.Company.findAll({
        include: [
            {
                model: customerDB.Industry,
            },
        ],
        where: {
            isActive: whereCondition
        }
    }).catch((err: any) => {
        log.error(err, "Error while getCompanies")
        //console.log(err)
        throw err
    })
    return companies
}
/*
 * get Compnay Details By details
 */
const getCompanyById = async (id: number) => {
    const company = await customerDB.Company.findOne({
        where: {
            id,
        },
        include: [{
            model: customerDB.Industry,
        }],
    }).catch((err: any) => {
        log.error(err, "Error while getCompanyById")
        //console.log(err)
        throw err
    })
    return company
}
/*
 * Create Compnay Details
 */
interface createCompnayParam {
    companyName: string
    description: string
    isActive: boolean
    industryId: number
}

const createCompany = async (param: createCompnayParam) => {
    const findCompnay = await customerDB.Company.findOne({
        where:{
            companyName:param.companyName
        }
    })
    if(findCompnay){
        return null;
    } else {
        const company = await customerDB.Company.create({
            companyName: param.companyName,
            description: param.description,
            isActive: param.isActive,
            industryId: param.industryId,
        }).catch((err) => {
            log.error(err, "Error while createCompany")
            //console.log(err)
            throw err
        })
        return company
    }
}
/*
 * Update Compnay Details
 */
interface updateCompnayParam {
    id: number
    companyName: string
    description: string
    isActive: boolean
    industryId: number
}

const updatedCompanyById = async (param: updateCompnayParam) => {
    const company = await customerDB.Company.findOne({
        where: { id: param.id },
    })
    let updatedCompany = null
    if (company) {
        company.companyName = param.companyName
        company.description = param.description
        company.isActive = param.isActive
        company.industryId = param.industryId
        updatedCompany = await company.save()
            .catch((err:any)=>{
                log.error(err, "Error while updatedCompany")
                //console.log(err)
                throw err;
        })
        return updatedCompany
    }
}

/*
 * Delete Compnay Details
 */

const deleteCompanyById = async (id:number) => {
    const Company = await customerDB.Company.findOne({
        where:{
            id:id
        }
    })
    let deleteCompany = null
    if(Company) {
        Company.isActive = false;
        deleteCompany = await Company.save()
        .catch((err:any)=>{
            log.error(err, "Error while deleteCompanyById")
            //console.log(err)
            throw err;
        })
        return deleteCompany
    }
}
const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById,
    deleteCompanyById
}

export { Company }
