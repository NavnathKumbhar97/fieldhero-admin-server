import generator from "generate-password"
import mjml from "mjml"
// local imports
import prisma from "../prisma"
import * as helper from "../helper"
import * as handler from "../handlers"
import * as config from "../config"
import mailer from "../../nodemailer"
import moment from "moment"
import logger from "../logs"
import path from "path"

const { log, httpStatus } = helper

const getAllAgents = async (take:any,skip:any): Promise<helper.IResponseObject> => {
    try {
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.agent.count({
            where: {
                createdBy: undefined,
            },
        })
        const agents = await prisma.agent.findMany({take:limit,skip:page,
            select: {
                id: true,
                agentNo: true,
                UserId: {
                    select: {
                        fullName: true,
                        isActive: true,
                        UserLogin: {
                            select: {
                                contactNo: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        })
        const result = agents.map((agent) => ({
            id: agent.id,
            agentNo: agent.agentNo,
            fullName: agent.UserId.fullName,
            isActive: agent.UserId.isActive,
            email: agent.UserId.UserLogin?.email,
            contactNo: agent.UserId.UserLogin?.contactNo,
        }))
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getAllData |  Message: Data Fetched Successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {result,count})
    } catch (error: any) {
        log.error(error.message, "Error while getAllAgents")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getAllData |  Message: Error while getAllAgents`)
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Agents not found"
        )

    }
}

const getAgentById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const agent = await prisma.agent.findFirst({
            where: {
                id,
            },
            select: {
                agentNo: true,
                bankAc: true,
                bankAcType: true,
                bankIfsc: true,
                bankName: true,
                companyName: true,
                docBankPath: true,
                docBankValue: true,
                docBanktype: true,
                docPoaPath: true,
                docPoaValue: true,
                docPoatype: true,
                docPoiPath: true,
                docPoiValue: true,
                docPoitype: true,
                id: true,
                gstin: true,
                panCardPath: true,
                professionalStatus: true,
                status: true,
                workLocation1: true,
                workLocation2: true,
                UserId: {
                    select: {
                        aadharCard: true,
                        currAddress: true,
                        currCity: true,
                        currCountry: true,
                        currState: true,
                        currZip: true,
                        dob: true,
                        fullName: true,
                        gender: true,
                        isActive: true,
                        note: true,
                        panCard: true,
                        permAddress: true,
                        permCity: true,
                        permCountry: true,
                        permState: true,
                        permZip: true,
                        primaryLang: true,
                        secondaryLang: true,
                        thirdLang: true,
                        UserLogin: {
                            select: {
                                email: true,
                                contactNo: true,
                            },
                        },
                    },
                },
            },
        })
        if (!agent)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Agent not found",
                agent
            )
        const { UserId, ...otherInAgent } = agent
        const { UserLogin, ...otherInUserId } = UserId
        const result = { ...otherInAgent, ...otherInUserId, ...UserLogin }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getAgentById |  Message: Agent Fetched by Id Successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getAgentById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getAgentById |  Message: Error while getAgentById.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAgentById"
        )
    }
}

interface ICreateAgentParam {
    fullName: string
    dob?: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    permAddress?: string
    permCity?: string
    permState?: string
    permCountry?: string
    permZip?: string
    currAddress?: string
    currCity?: string
    currState?: string
    currCountry?: string
    currZip?: string
    panCard?: string
    aadharCard?: string
    primaryLang?: string
    secondaryLang?: string
    thirdLang?: string
    note?: string
    isActive?: boolean
    email: string
    contactNo?: string
    agentNo?: string
    professionalStatus?: string
    gstin?: string
    companyName?: string
    bankName?: string
    bankAc?: string
    bankIfsc?: string
    bankAcType?: string
    workLocation1?: string
    workLocation2?: string
    status?: "PENDING" | "REGISTERED" | null,
    panCardPath:string,
    docPoitype:string,
    docPoiValue:string,
    docPoiPath:string,
    docPoatype:string,
    docPoaValue:string,
    docPoaPath:string,
    docBanktype:string,
    docBankValue:string,
    docBankPath:string
}

const createAgent = async (
    userLoginId: number,
    param: ICreateAgentParam
): Promise<helper.IResponseObject> => {
    try {
        const agentFound = await prisma.agent.findFirst({
            where: {
                UserId: {
                    OR: [
                        { aadharCard: param.aadharCard },
                        { panCard: param.panCard },
                    ],
                    UserLogin: {
                        OR: [
                            {
                                email: param.email,
                            },
                            {
                                contactNo: param.contactNo,
                            },
                        ],
                    },
                },
            },
            include: { UserId: { include: { UserLogin: true } } },
        })

        if (agentFound) {
            if (agentFound.UserId.UserLogin?.email === param.email)
                return helper.getHandlerResponseObject(
                    false,
                    httpStatus.Bad_Request,
                    "Email is already used.",
                    null
                )
            if (agentFound.UserId.UserLogin?.contactNo === param.contactNo)
                return helper.getHandlerResponseObject(
                    false,
                    httpStatus.Bad_Request,
                    "Contact no is already used.",
                    null
                )
        }

        const password = generator.generate({
            length: 12,
            lowercase: true,
            numbers: true,
            uppercase: true,
            strict: true,
        })
        const passwordHash = await helper.passwordfunction.encryptPassword(
            password
        )

        const agent = await prisma.user.create({
            data: {
                fullName: param.fullName,
                dob: moment(param.dob).toDate() || undefined,
                gender: param.gender || undefined,
                permAddress: param.permAddress || undefined,
                permCity: param.permCity || undefined,
                permState: param.permState || undefined,
                permCountry: param.permCountry || undefined,
                permZip: param.permZip || undefined,
                currAddress: param.currAddress || undefined,
                currCity: param.currCity || undefined,
                currState: param.currState || undefined,
                currCountry: param.currCountry || undefined,
                currZip: param.currZip || undefined,
                panCard: param.panCard || undefined,
                aadharCard: param.aadharCard || undefined,
                primaryLang: param.primaryLang || undefined,
                secondaryLang: param.secondaryLang || undefined,
                thirdLang: param.thirdLang || undefined,
                note: param.note || undefined,
                isActive: "isActive" in param ? param.isActive : true,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                UserLogin: {
                    create: {
                        email: param.email,
                        passwordHash,
                        roleId: 3,
                        contactNo: param.contactNo || undefined,
                        isSystemGenerated: false,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    },
                },
                Agent: {
                    create: {
                        agentNo: param.agentNo || undefined,
                        professionalStatus:
                            param.professionalStatus || undefined,
                        gstin: param.gstin || undefined,
                        companyName: param.companyName || undefined,
                        bankName: param.bankName || undefined,
                        bankAc: param.bankAc || undefined,
                        bankIfsc: param.bankIfsc || undefined,
                        bankAcType: param.bankAcType || undefined,
                        workLocation1: param.workLocation1 || undefined,
                        workLocation2: param.workLocation2 || undefined,
                        status: param.status || undefined,
                        panCardPath: param.panCardPath || undefined,
                        docPoiPath: param.docPoiPath || undefined,
                        docPoitype:param.docPoitype || undefined,
                        docPoiValue:param.docPoiValue || undefined,
                        docBankPath:param.docBankPath || undefined,
                        docBanktype:param.docBanktype || undefined,
                        docBankValue:param.docBankValue || undefined,
                        docPoaPath:param.docPoaPath || undefined,
                        docPoaValue:param.docPoaValue || undefined,
                        docPoatype:param.docPoatype || undefined,
                        createdBy: userLoginId,
                        modifiedBy: userLoginId,
                    },
                },
            },
        })

        if (process.env.NODE_ENV !== "test") {
            const _template = handler.emailTemplate.createAgent(
                param.fullName,
                param.email,
                password
            )
            const html = mjml(_template.template).html
            helper.Email.sendEmail(
                _template.id,
                html,
                param.email,
                "Fieldhero - Agent - Account Created Successfully"
            )
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : createAgent |  Message: Agent Created Successfully.`);
        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Agent created successfully",
            agent
        )
        
    } catch (error: any) {
        log.error(error.message, "Error while createAgent")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : createAgent |  Message: Error while createAgent.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createAgent"
        )
    }
}

interface IUpdateAgentParam {
    fullName: string
    dob?: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    permAddress?: string
    permCity?: string
    permState?: string
    permCountry?: string
    permZip?: string
    currAddress?: string
    currCity?: string
    currState?: string
    currCountry?: string
    currZip?: string
    panCard?: string
    aadharCard?: string
    primaryLang?: string
    secondaryLang?: string
    thirdLang?: string
    note?: string
    isActive?: boolean
    contactNo?: string
    professionalStatus?: string
    gstin?: string
    companyName?: string
    bankName?: string
    bankAc?: string
    bankIfsc?: string
    bankAcType?: string
    workLocation1?: string
    workLocation2?: string,
    panCardPath:string,
    docPoitype:string,
    docPoiValue:string,
    docPoiPath:string,
    docPoatype:string,
    docPoaValue:string,
    docPoaPath:string,
    docBanktype:string,
    docBankValue:string,
    docBankPath:string
}

const updateAgent = async (
    userLoginId: number,
    agentid: number,
    param: IUpdateAgentParam
): Promise<helper.IResponseObject> => {
    try {
        const userLoginUpdate = prisma.userLogin.updateMany({
            where: {
                User: {
                    Agent: {
                        id: agentid,
                    },
                },
            },
            data: {
                contactNo: param.contactNo,
                modifiedBy: userLoginId,
            },
        })
        const userUpdate = prisma.user.updateMany({
            where: {
                Agent: {
                    id: agentid,
                },
            },
            data: {
                fullName: param.fullName,
                dob: moment(param.dob).toDate(),
                gender: param.gender,
                permAddress: param.permAddress,
                permCity: param.permCity,
                permState: param.permState,
                permCountry: param.permCountry,
                permZip: param.permZip,
                currAddress: param.currAddress,
                currCity: param.currCity,
                currState: param.currState,
                currCountry: param.currCountry,
                currZip: param.currZip,
                panCard: param.panCard,
                aadharCard: param.aadharCard,
                primaryLang: param.primaryLang,
                secondaryLang: param.secondaryLang,
                thirdLang: param.thirdLang,
                note: param.note,
                isActive: "isActive" in param ? param.isActive : true,
                modifiedBy: userLoginId,
            },
        })

        const agentUpdate = prisma.agent.update({
            where: { id: agentid },
            data: {
                professionalStatus:
                    "professionalStatus" in param
                        ? param.professionalStatus
                        : undefined,
                gstin: param.gstin,
                companyName: param.companyName,
                bankName: param.bankName,
                bankAc: param.bankAc,
                bankIfsc: param.bankIfsc,
                bankAcType: param.bankAcType,
                workLocation1: param.workLocation1,
                workLocation2: param.workLocation2,
                panCardPath: param.panCardPath || undefined,
                        docPoiPath: param.docPoiPath || undefined,
                        docPoitype:param.docPoitype || undefined,
                        docPoiValue:param.docPoiValue || undefined,
                        docBankPath:param.docBankPath || undefined,
                        docBanktype:param.docBanktype || undefined,
                        docBankValue:param.docBankValue || undefined,
                        docPoaPath:param.docPoaPath || undefined,
                        docPoaValue:param.docPoaValue || undefined,
                        docPoatype:param.docPoatype || undefined,
                modifiedBy: userLoginId,
            },
        })

        const [, , agent] = await prisma.$transaction([
            userLoginUpdate,
            userUpdate,
            agentUpdate,
        ])
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateAgent |  Message: Agent Updated Successfully.`);
        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Agent updated successfully",
            agent
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateAgent")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateAgent |  Message: Error While updateAgent.`);
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateAgent"
        )
    }
}

const Agent = {
    getAllAgents,
    getAgentById,
    createAgent,
    updateAgent,
}

export { Agent }
