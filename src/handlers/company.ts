// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper

//* get All Companies Details
const getCompanies = async (all: string): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const companies = await prisma.company.findMany({
            where: {
                isActive: whereCondition,
            },
            include: {
                IndustryId: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                companyName: "asc",
            },
        })

        const result = companies.map((comp) => ({
            id: comp.id,
            companyName: comp.companyName,
            isActive: comp.isActive,
            industry: comp.IndustryId?.title,
        }))

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getCompanies")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCompanies"
        )
    }
}

/*
 * get Compnay Details By details
 */
const getCompanyById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const company = await prisma.company.findFirst({
            where: {
                id,
            },
            include: {
                IndustryId: true,
            },
        })
        if (!company)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Company not found"
            )

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", company)
    } catch (error: any) {
        log.error(error.message, "Error while getCompanyById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCompanyById"
        )
    }
}
/*
 * Create Compnay Details
 */
interface createCompnayParam {
    companyName: string
    description: string
    isActive: boolean
    industryId: string | number
}

const createCompany = async (
    userLoginId: number,
    param: createCompnayParam
): Promise<helper.IResponseObject> => {
    try {
        const companyFound = await prisma.company.findFirst({
            where: {
                companyName: param.companyName,
            },
        })
        if (companyFound) {
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Company already exist"
            )
        }

        const company = await prisma.company.create({
            data: {
                companyName: param.companyName,
                description: param.description,
                isActive: param.isActive,
                IndustryId: {
                    connectOrCreate: {
                        where: {
                            id:
                                typeof param.industryId === "number"
                                    ? param.industryId
                                    : undefined,
                            title:
                                typeof param.industryId === "string"
                                    ? param.industryId
                                    : undefined,
                        },
                        create: {
                            title:
                                typeof param.industryId === "number"
                                    ? param.industryId + ""
                                    : param.industryId,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    },
                },
                CreatedBy: { connect: { id: userLoginId } },
                ModifiedBy: { connect: { id: userLoginId } },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Company created successfully",
            company
        )
    } catch (error: any) {
        log.error(error.message, "Error while createCompany")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCompany"
        )
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
    industryId: string | number
}

const updatedCompanyById = async (
    userLoginId: number,
    param: updateCompnayParam
): Promise<helper.IResponseObject> => {
    try {
        const companyFound = await prisma.company.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!companyFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Company not found"
            )

        let industryId: number | undefined =
            typeof param.industryId !== "string" ? param.industryId : undefined
        if (typeof param.industryId === "string") {
            const _industry = await prisma.industry.create({
                data: {
                    title: param.industryId,
                    createdBy: userLoginId,
                    modifiedBy: userLoginId,
                },
            })
            industryId = _industry.id
        }

        const company = await prisma.company.update({
            where: {
                id: companyFound.id,
            },
            data: {
                companyName: param.companyName,
                description: param.description,
                isActive: param.isActive,
                industryId: industryId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Company updated successfully",
            company
        )
    } catch (error: any) {
        log.error(error.message, "Error while updatedCompanyById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updatedCompanyById"
        )
    }
}

const Company = {
    getCompanies,
    getCompanyById,
    createCompany,
    updatedCompanyById,
}

export { Company }
