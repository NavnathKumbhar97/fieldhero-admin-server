// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper

// * get All Industries Details
const getIndustries = async (all: string,take:any,skip:any): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.industry.count({
            where: {
                createdBy: undefined,
            },
        })

        const industries = await prisma.industry.findMany({take:limit,skip:page,
            where: {
                isActive: whereCondition,
            },
            orderBy: { title: "asc" },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            {industries,count}
        )
    } catch (error: any) {
        log.error(error.message, "Error while getIndustries")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getIndustries"
        )
    }
}

//* get Industry Details By Id
const getIndustryById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const industry = await prisma.industry.findFirst({
            where: { id },
        })
        if (!industry)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Industry not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            industry
        )
    } catch (error: any) {
        log.error(error.message, "Error while getIndustryById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getIndustryById"
        )
    }
}

//* Create Industry Details
interface createIndustryParam {
    title: string
    description?: string
    isActive?: boolean
}

const createIndustry = async (
    userLoginId: number,
    param: createIndustryParam
): Promise<helper.IResponseObject> => {
    try {
        if (!param.title) {
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Title is required"
            )
        }
        const industryFound = await prisma.industry.findFirst({
            where: {
                title: param.title.toUpperCase(),
            },
        })
        if (industryFound) {
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Industry already exist"
            )
        }

        const industry = await prisma.industry.create({
            data: {
                title: param.title.toUpperCase(),
                description: param.description || undefined,
                isActive: "isActive" in param ? param.isActive : true,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Industry created successfully",
            industry
        )
    } catch (error: any) {
        log.error(error.message, "Error while createIndustry")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createIndustry"
        )
    }
}

//* Update Industry Details
interface updateIndustryParam {
    id: number
    title: string
    description?: string
    isActive?: boolean
}
const updateIndustryById = async (
    userLoginId: number,
    param: updateIndustryParam
): Promise<helper.IResponseObject> => {
    try {
        const industryFound = await prisma.industry.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!industryFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Industry not found"
            )
        if (!param.title) {
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Title is required"
            )
        }
        const industry = await prisma.industry.update({
            where: {
                id: param.id,
            },
            data: {
                title: param.title.toUpperCase(),
                description: param.description || undefined,
                isActive: "isActive" in param ? param.isActive : undefined,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Industry updated successfully",
            industry
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateIndustryById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateIndustryById"
        )
    }
}

const Industry = {
    getIndustries,
    getIndustryById,
    createIndustry,
    updateIndustryById,
    // deleteIndustryById,
}
export { Industry }
