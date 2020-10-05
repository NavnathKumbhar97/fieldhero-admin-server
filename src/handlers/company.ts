import { customerDB } from "../sequelize"

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
    }).catch((ex: any) => {
        throw ex
    })
    return companies
}

const getCompanyById = async (id: number) => {
    const company = await customerDB.Company.findOne({
        where: {
            id,
        },
        include: [
            {
                model: customerDB.Industry,
            },
        ],
    }).catch((ex: any) => {
        throw ex
    })
    return company
}

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
            throw err
        })
        return company
    }
}

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
    }
    return updatedCompany
}

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
    }
    return deleteCompany
}
const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById,
    deleteCompanyById
}

export { Company }
