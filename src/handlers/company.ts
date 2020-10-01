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
    const industry = await customerDB.Company.create({
        companyName: param.companyName,
        description: param.description,
        isActive: param.isActive,
        industryId: param.industryId,
    }).catch((err) => {
        throw err
    })
    return industry
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
    let updatedSkill = null
    if (company) {
        company.companyName = param.companyName
        company.description = param.description
        company.isActive = param.isActive
        company.industryId = param.industryId
        updatedSkill = await company.save()
    }
    return updatedSkill
}

const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById,
}

export { Company }
