import { customerDB } from "../sequelize"

const getCompanies = async () => {
    const companies = await customerDB.Company.findAll({
        include: [
            {
                model: customerDB.Industry,
            },
        ],
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
    const Compnay = await customerDB.Company.findOne({
        where:{
            companyName:param.companyName
        }
    })
    if(Company){
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

const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById,
}

export { Company }
