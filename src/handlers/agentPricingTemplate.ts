import prisma from "../prisma"
import {
    IResponseObject,
    log,
    getHandlerResponseObject,
    httpStatus,
} from "../helper"

// * fetch all agent pricing templates
const fetchAll = async (all: string,take:any,skip:any): Promise<IResponseObject> => {
    try {
        let whereCondition:  undefined 
        if (all === "*") whereCondition = undefined
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.agentPricingTemplate.count({
            where: {
                createdBy: undefined,
            },
        })

        const agentPricingTemplates =
            await prisma.agentPricingTemplate.findMany({
                where: {
                    isActive: whereCondition,
                },
                select: {
                    id: true,
                    templateName: true,
                    description: true,
                    isActive: true,
                    totalAmount: true,
                },
                orderBy: {
                    id: "desc",
                },
            })
        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            {agentPricingTemplates,count}
        )
    } catch (error: any) {
        log.error(
            error.message,
            "Error while fetch all agent pricing templates"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch all agent pricing templates"
        )
    }
}

// * fetch agent pricing template by id
const fetchById = async (id: number): Promise<IResponseObject> => {
    try {
        const template = await prisma.agentPricingTemplate.findFirst({
            where: {
                id,
            },
            include: {
                CreatedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
                ModifiedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        })

        // if template not found
        if (!template)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Agent pricing template not found"
            )

        const { CreatedBy, ModifiedBy, ...other } = template
        const result = {
            ...other,
            CreatedBy: CreatedBy?.User.fullName,
            ModifiedBy: ModifiedBy?.User.fullName,
        }
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(
            error.message,
            "Error while fetch agent pricing template by id"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch agent pricing template by id"
        )
    }
}

interface ICreateParam {
    templateName: string
    description?: string
    approvalRemarks?: string
    industry: number
    category: number
    education: number
    fullName: number
    dob: number
    gender: number
    primaryLanguage: number
    secondaryLanguage: number
    contactNo1: number
    contactNo2: number
    currAddress: number
    currCity: number
    currState: number
    currZip: number
    permAddress: number
    permCity: number
    permState: number
    permZip: number
    email1: number
    location1: number
    location2: number
    exp: number
    lastCompanyName: number
    designation: number
    startDate: number
    endDate: number
    jobDescription: number
    primarySkill: number
    secondarySkill: number
    aadhar: number
    pan: number
    dl: number
    isActive?: boolean
}
const create = async (
    userLoginId: number,
    param: ICreateParam
): Promise<IResponseObject> => {
    try {
        // if templateName is blank or null
        if (!param.templateName)
            return getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "Template name is required",
                null
            )
        const templateFound = await prisma.agentPricingTemplate.findFirst({
            where: {
                templateName: param.templateName,
            },
        })
        if (templateFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Template name already used. Please use different name.",
                null
            )
        const { templateName, description, isActive, ...other } = param
        const total: number = Object.values(other).reduce(
            (prev: number, curr: number) => prev + curr,
            0
        )
        const template = await prisma.agentPricingTemplate.create({
            data: {
                templateName: param.templateName,
                description: param.description,
                approvalRemarks: param.approvalRemarks,
                isActive: "isActive" in param ? param.isActive : false,
                industry: param.industry,
                category: param.category,
                education: param.education,
                fullName: param.fullName,
                dob: param.dob,
                primaryLanguage: param.primaryLanguage,
                secondaryLanguage: param.secondaryLanguage,
                currCity: param.currCity,
                currZip: param.currZip,
                email1: param.email1,
                contactNo1: param.contactNo1,
                expYears: param.exp,
                preferLocation1: param.location1,
                preferLocation2: param.location2,
                skill1: param.primarySkill,
                skill2: param.secondarySkill,
                lastCompany: param.lastCompanyName,
                designation: param.designation,
                totalAmount: total,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        // if isActive is true
        if (param.isActive === true) {
            await prisma.agentPricingTemplate.updateMany({
                where: {
                    id: {
                        not: template.id,
                    },
                },
                data: {
                    isActive: false,
                    modifiedBy: userLoginId,
                },
            })
        }

        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Agent pricing template created successfully",
            template
        )
    } catch (error: any) {
        log.error(error.message, "Error while create agent pricing template")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create agent pricing template"
        )
    }
}

const setActiveById = async (
    userLoginId: number,
    id: number
): Promise<IResponseObject> => {
    try {
        const templateFound = await prisma.agentPricingTemplate.findFirst({
            where: {
                id,
            },
            select: { id: true },
        })

        // if template not found
        if (!templateFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Agent pricing template not found",
                null
            )

        await prisma.agentPricingTemplate.update({
            where: {
                id,
            },
            data: {
                isActive: true,
                modifiedBy: userLoginId,
            },
        })
        await prisma.agentPricingTemplate.updateMany({
            where: {
                id: { not: id },
            },
            data: {
                isActive: false,
                modifiedBy: userLoginId,
            },
        })

        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Agent pricing template set to active successfully",
            null
        )
    } catch (error: any) {
        log.error(error.message, "Error while setActiveById")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while setActiveById"
        )
    }
}

const AgentPricingTemplate = { fetchAll, fetchById, create, setActiveById }

export { AgentPricingTemplate }
