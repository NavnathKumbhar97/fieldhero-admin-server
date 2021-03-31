import { PrismaClient } from "@prisma/client"
import generator from "generate-password"
import mjml from "mjml"
// local imports
import * as helper from "../helper"
import * as handler from "../handlers"
import * as config from "../config"
import mailer from "../../nodemailer"
const { log, httpStatus } = helper
const prisma = new PrismaClient()

const getAllAgents = async (): Promise<helper.IResponseObject> => {
    try {
        const agents = await prisma.agent.findMany()
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", agents)
    } catch (error) {
        log.error("Error while getAllAgents", error.message)
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
        })
        if (!agent)
            return helper.getHandlerResponseObject(
                true,
                httpStatus.OK,
                "Agent not found",
                agent
            )
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", agent)
    } catch (error) {
        log.error("Error while getAgentById", error.message)
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
    status?: "PENDING" | "REGISTERED" | null
}

const createAgent = async (
    userId: number,
    param: ICreateAgentParam
): Promise<helper.IResponseObject> => {
    try {
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
                dob: param.dob || undefined,
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
                createdBy: userId,
                modifiedBy: userId,
                UserLogin: {
                    create: {
                        email: param.email,
                        passwordHash,
                        roleId: 3,
                        contactNo: param.contactNo || undefined,
                        isSystemGenerated: false,
                        createdBy: userId,
                        modifiedBy: userId,
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
                        createdBy: userId,
                        modifiedBy: userId,
                    },
                },
            },
        })

        const html = mjml(
            handler.emailTemplate.createAgent(
                param.fullName,
                param.email,
                password
            )
        ).html
        mailer.sendMail({
            to: [param.email],
            from: config.EMAIL_FROM,
            subject: "Fieldhero - Agent - Account Created Successfully",
            html,
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Agent created successfully",
            agent
        )
    } catch (error) {
        console.log(error)
        log.error("Error while createAgent", error.message)
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
    workLocation2?: string
}

const updateAgent = async (
    userId: number,
    agentid: number,
    param: IUpdateAgentParam
): Promise<helper.IResponseObject> => {
    try {
        const agent = await prisma.user.update({
            where: { id: agentid },
            data: {
                fullName: param.fullName,
                dob: param.dob || undefined,
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
                modifiedBy: userId,
                UserLogin: {
                    update: {
                        contactNo: param.contactNo || undefined,
                        modifiedBy: userId,
                    },
                },
                Agent: {
                    update: {
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
                        modifiedBy: userId,
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Agent updated successfully",
            agent
        )
    } catch (error) {
        console.log(error)
        log.error("Error while updateAgent", error.message)
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
