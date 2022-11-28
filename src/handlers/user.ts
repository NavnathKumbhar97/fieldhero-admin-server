import mjml from "mjml"
import crypto from "crypto"
import moment from "moment"
import generator from "generate-password"
import bcrypt from "bcrypt"
// local imports
import * as helper from "../helper"
import { emailTemplate } from "../handlers/mjml"
import mailer from "../../nodemailer"
import * as config from "../config"
import prisma from "../prisma"
import logger from "../logs"
import path from "path"

const { log, passwordfunction, httpStatus } = helper

/**
 * Create User Details
 */
interface createUserParam {
    fullName: string
    birthDate: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    currAddress: string
    currCity: string
    currState: string
    currZip: string
    permAddress: string
    permCity: string
    permState: string
    permZip: string
    primaryLang: string
    secondaryLang: string
    thirdLang: string
    aadharCard: string
    panCard: string
    note: string
    profileImage: string
    isActive: boolean
    roleId: number | undefined
    email: string
    contactNo: string
}
const createUser = async (
    userLoginId: number,
    param: createUserParam
): Promise<helper.IResponseObject> => {
    try {
        const userFound = await prisma.userLogin.findFirst({
            where: {
                OR: [
                    {
                        email: param.email,
                    },
                    {
                        contactNo: param.contactNo,
                    },
                ],
            },
        })
        if (userFound) {
            if (userFound.email === param.email){
                logger.warn(`File Name: ${path.basename(__filename)} | Method Name : createUser | Message: Email already exist.`);

                return helper.getHandlerResponseObject(
                    false,
                    httpStatus.Conflict,
                    "Email already exist"
                    )
                }
            if (userFound.contactNo === param.contactNo){
                logger.warn(`File Name: ${path.basename(__filename)} | Method Name : createUser | Message: Contact no is already used.`);

                return helper.getHandlerResponseObject(
                    false,
                    httpStatus.Conflict,
                    "Contact no is already used"
                    )
                }
        }

        const autoPassword = Math.random().toString(36).slice(-8)
        const encPassword = await passwordfunction.encryptPassword(autoPassword)
        const user = await prisma.user.create({
            data: {
                fullName: param.fullName,
                dob: moment(param.birthDate).toDate(),
                gender: param.gender,
                currAddress: param.currAddress,
                currCity: param.currCity,
                currState: param.currState,
                currCountry: "India",
                currZip: param.currZip,
                permAddress: param.permAddress,
                permCity: param.permCity,
                permState: param.permState,
                permCountry: "India",
                permZip: param.permZip,
                primaryLang: param.primaryLang,
                secondaryLang: param.secondaryLang,
                thirdLang: param.thirdLang,
                aadharCard: param.aadharCard,
                panCard: param.panCard,
                note: param.note,
                isActive: "isActive" in param ? param.isActive : true,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                UserLogin: {
                    create: {
                        email: param.email,
                        contactNo: param.contactNo,
                        passwordHash: encPassword,
                        Role: {
                            connect: {
                                id: param.roleId,
                            },
                        },
                    },
                },
            },
        })

        const _template = emailTemplate.generatePassword(
            param.fullName,
            param.email,
            autoPassword
        )

        const html = mjml(_template.template).html
        helper.Email.sendEmail(
            _template.id,
            html,
            param.email,
            "Fieldhero Admin - Your Password"
        )
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : createUser | Message: User created successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "User created successfully",
            user
        )
    } catch (error: any) {
        log.error(error.message, "Error while createUser")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : createUser | Message: Error while createUser.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createUser"
        )
    }
}

/**
 * Get All User Details
 * @param all
 */
const getUsers = async (all: string,take:any,skip:any): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.user.count({
            where: {
                id: undefined,
            },
        })


        const users = await prisma.user.findMany({take: limit, skip:page,
            select: {
                id: true,
                fullName: true,
                isActive: true,
                UserLogin: {
                    select: {
                        email: true,
                        Role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            where: {
                isActive: whereCondition,
                UserLogin: {
                    roleId: {
                        not: 3,
                    },
                },
            },
            orderBy: {
                fullName: "asc",
            },
        })

        const result = users.map((user) => ({
            id: user.id,
            fullName: user.fullName,
            isActive: user.isActive,
            email: user.UserLogin?.email,
            role: user.UserLogin?.Role.name,
        }))
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getUsers | Message: Get All User Details successfully.`);

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {result,count})
    } catch (error: any) {
        log.error(error.message, "Error while getUsers")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getUsers | Message: Error while getUsers.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getUsers"
        )
    }
}

const getUserById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                fullName: true,
                dob: true,
                gender: true,
                currAddress: true,
                currCity: true,
                currState: true,
                currCountry: true,
                currZip: true,
                permAddress: true,
                permCity: true,
                permState: true,
                permCountry: true,
                permZip: true,
                primaryLang: true,
                secondaryLang: true,
                thirdLang: true,
                aadharCard: true,
                panCard: true,
                note: true,
                profileImage: true,
                isActive: true,
                UserLogin: {
                    select: {
                        email: true,
                        contactNo: true,
                        roleId: true,
                    },
                },
            },
        })
        if (!user){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : getUserById | Message: User not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "User not found"
                )
            }
        const { UserLogin, ...rest } = user
        const result = {
            ...rest,
            email: UserLogin?.email,
            roleId: UserLogin?.roleId,
            contactNo: UserLogin?.contactNo,
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getUserById | Message: Get All User Details successfully.`);

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getUserById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getUserById | Message: Error while getUserById.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getUserById"
        )
    }
}

/*
 * Update User Details
 */
interface UpdateUserParam {
    id: number
    fullName: string
    birthDate: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    currAddress: string
    currCity: string
    currState: string
    currZip: string
    permAddress: string
    permCity: string
    permState: string
    permZip: string
    primaryLang: string
    secondaryLang: string
    thirdLang: string
    aadharCard: string
    panCard: string
    note: string
    profileImage: string
    isActive: boolean
    roleId: number
    email: string
    contactNo: string
}
const updateUserById = async (
    userLoginId: number,
    param: UpdateUserParam
): Promise<helper.IResponseObject> => {
    try {
        const userFound = await prisma.user.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!userFound){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateUserById | Message: User not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "User not found"
                )
            }

        const user = await prisma.user.update({
            where: {
                id: param.id,
            },
            data: {
                fullName: param.fullName,
                dob: param.birthDate,
                gender: param.gender,
                currAddress: param.currAddress,
                currCity: param.currCity,
                currState: param.currState,
                currCountry: "India",
                currZip: param.currZip,
                permAddress: param.permAddress,
                permCity: param.permCity,
                permState: param.permState,
                permCountry: "India",
                permZip: param.permZip,
                primaryLang: param.primaryLang,
                secondaryLang: param.secondaryLang,
                thirdLang: param.thirdLang,
                aadharCard: param.aadharCard,
                panCard: param.panCard,
                note: param.note,
                isActive: "isActive" in param ? param.isActive : undefined,
                modifiedBy: userLoginId,
                UserLogin: {
                    update: {
                        roleId: param.roleId,
                        email: param.email,
                        contactNo: param.contactNo,
                        modifiedBy: userLoginId,
                    },
                },
            },
            include: {
                UserLogin: true,
            },
        })
        const { UserLogin, ...rest } = user
        const result = { ...rest, ...UserLogin }

        logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateUserById | Message: User updated successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "User updated successfully",
            result
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateUserById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateUserById | Message: Error while updateUserById.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateUserById"
        )
    }
}

const createResetPasswordToken = async (
    email: string
): Promise<helper.IResponseObject> => {
    try {
        const userLoginFound = await prisma.userLogin.findFirst({
            where: { email },
        })
        if (!userLoginFound)
        {
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : createResetPasswordToken | Message: Email not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Email not found"
                )
            }

        const token = crypto.randomBytes(32).toString("hex")
        const userLogin = await prisma.userLogin.update({
            where: {
                id: userLoginFound.id,
            },
            data: {
                resetToken: token,
                resetExpires: moment(Date.now() + 3600000).toDate(),
                modifiedBy: userLoginFound.id,
            },
            include: {
                User: {
                    select: {
                        fullName: true,
                    },
                },
            },
        })

        const _template = emailTemplate.generateForgotPasswordEmail({
            fullName: userLogin.User.fullName,
            email: userLogin.email,
            token,
        })
        const html = mjml(_template.template).html

        helper.Email.sendEmail(
            _template.id,
            html,
            userLogin.email,
            "Fieldhero Admin - Reset Password Request"
        )
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : createResetPasswordToken | Message: Password reset request has been sent on your email.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.OK,
            "Password reset request has been sent on your email"
        )
    } catch (error: any) {
        log.error(error.message, "Error while createResetPasswordToken")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : createResetPasswordToken | Message: Error while createResetPasswordToken.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createResetPasswordToken"
        )
    }
}

const resetPasswordForUser = async (
    token: string,
    email: string
): Promise<helper.IResponseObject> => {
    try {
        const userLoginFound = await prisma.userLogin.findFirst({
            where: {
                email,
            },
            include: {
                User: {
                    select: {
                        fullName: true,
                    },
                },
            },
        })
        if (!userLoginFound){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : resetPasswordForUser | Message: Email not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Email not found"
                )
            }

        if (userLoginFound.resetToken !== token)
        {
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : resetPasswordForUser | Message: Token mismatch.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "Token mismatch"
                )
            }

        const isTokenValid = moment(userLoginFound.resetExpires).isAfter(
            moment()
        )
        if (!isTokenValid){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : resetPasswordForUser | Message: Token expired. Please request reset password again..`);

            return {
                status: false,
                code: httpStatus.Bad_Request,
                message: "Token expired. Please request reset password again.",
            }
        }

        const newPassword = generator.generate({
            excludeSimilarCharacters: true,
            length: 12,
            lowercase: true,
            uppercase: true,
            numbers: true,
            symbols: false,
            strict: true,
        })
        const newPasswordHash = await bcrypt.hash(
            newPassword,
            config.BCRYPT_ROUNDS
        )

        const userLogin = await prisma.userLogin.update({
            where: {
                id: userLoginFound.id,
            },
            data: {
                resetToken: null,
                resetExpires: null,
                passwordHash: newPasswordHash,
                modifiedBy: userLoginFound.id,
            },
        })

        const _template = emailTemplate.generateResetPasswordSuccessEmail({
            fullName: userLoginFound.User.fullName,
            password: newPassword,
        })
        const html = mjml(_template.template).html
        helper.Email.sendEmail(
            _template.id,
            html,
            userLogin.email,
            "Fieldhero Admin - Password Reset Successfully"
        )
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : resetPasswordForUser | Message: Password reset successfully. New password has been sent on your email.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Password reset successfully. New password has been sent on your email"
        )
    } catch (error: any) {
        log.error(error.message, "Error while resetPasswordForUser")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : resetPasswordForUser | Message: Error while resetPasswordForUser.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while resetPasswordForUser"
        )
    }
}

const changePassword = async (
    userLoginId: number,
    oldPassword: string,
    newPassword: string
): Promise<helper.IResponseObject> => {
    try {
        const userLoginFound = await prisma.userLogin.findFirst({
            where: {
                id: userLoginId,
            },
        })
        if (!userLoginFound){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : changePassword | Message: User not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "User not found"
                )
            }
                
        const isPasswordSame = await passwordfunction.verifyPassword(
            oldPassword,
            userLoginFound.passwordHash
        )
        if (!isPasswordSame)
        {
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : changePassword | Message: Old password is wrong.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "Old password is wrong"
                )
            }

        const newEncPassword = await passwordfunction.encryptPassword(
            newPassword
        )
        await prisma.userLogin.update({
            where: {
                id: userLoginFound.id,
            },
            data: {
                passwordHash: newEncPassword,
                modifiedBy: userLoginId,
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : changePassword | Message: Password changed successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Password changed successfully"
        )
    } catch (error: any) {
        log.error(error.message, "Error while changePassword")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : changePassword | Message: Error while changePassword.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while changePassword"
        )
    }
}

const User = {
    createUser,
    getUsers,
    getUserById,
    updateUserById,
    createResetPasswordToken,
    resetPasswordForUser,
    changePassword,
}
export { User }
