import { customerDB } from "../sequelize"

const getCompanies = async () => {
    const companies = await customerDB.Company.findAll({
        include: [
            {
                model: customerDB.Industry,
            },
        ],
    }).catch((ex:any) => {
        throw ex
    })
    return companies
}

const getCompanyById = async (id:number) => {
    const company = await customerDB.Company.findOne({
        where: {
            id,
        },
        include: [
            {
                model: customerDB.Industry,
            },
        ],
    }).catch((ex:any) => {
        throw ex
    })
    return company
}

interface createCompnayParam {
    companyName: string
    description: string
    isActive: boolean
    industryId:number
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
    id:number
    companyName: string
    description: string
    isActive: boolean
    industryId:number
}

const updatedCompanyById = async (param:updateCompnayParam) => {
    try {
        let company = await customerDB.Company.findOne({ 
            where: 
            { id:param.id }
        })
        // @ts-ignore: Object is possibly 'null'.
        company.companyName = param.companyName // @ts-ignore: Object is possibly 'null'.
        company.description = param.description // @ts-ignore: Object is possibly 'null'.
        company.isActive = param.isActive // @ts-ignore: Object is possibly 'null'.
        company.industryId = param.industryId // @ts-ignore: Object is possibly 'null'.
        let updatedSkill = await company.save()
        return updatedSkill
    } catch (error) {
        throw error
    }
}


const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById
}

export { Company }