import mjml from "mjml"
import { Op } from "sequelize"
import crypto from "crypto"
import moment from "moment"
import generator from "generate-password"
import bcrypt from "bcrypt"
// local imports
import { customerDB, ormCustomer } from "../sequelize"
import { log, passwordfunction, httpStatus } from "../helper"
import { emailTemplate } from "../handlers/mjml"
import mailer from "../../nodemailer"
import * as config from "../config"

/**
 * Create User Details
 */
interface createUserParam {
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
    address: string
    state: string
    country: string
    profileImage: string
    isActive: boolean
    roleId: number
    email: string
}
const createUser = async (param: createUserParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const autoPassword = Math.random().toString(36).slice(-8)
        const userDetails = await customerDB.User.create(
            {
                fullName: param.fullName,
                birthDate: param.birthDate || null,
                gender: param.gender,
                address: param.address,
                state: param.state,
                country: param.country,
                isActive: param.isActive,
            },
            { transaction }
        )

        const userLogin = await customerDB.UserLogin.create(
            {
                userId: userDetails.id,
                roleId: param.roleId,
                email: param.email,
                passwordHash: await passwordfunction.encryptPassword(
                    autoPassword
                ),
            },
            { transaction }
        )

        const html = mjml(
            emailTemplate.generatePassword(
                userDetails.fullName,
                userLogin.email,
                autoPassword
            ),
            { beautify: true }
        )
        mailer
            .sendMail({
                to: [param.email],
                from: `"Field Hero" <no-reply@fieldhero.in>`,
                subject: "Your Password",
                html: html.html,
            })
            .then((success) => log.info(success))
            .catch((err) => log.error(err))
        await transaction.commit()
        return Object.assign({ userDetails, userLogin })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while createUser")
        throw err
    }
}

/**
 * Get All User Details
 * @param all
 */
const getUser = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const users = await customerDB.User.findAll({
        attributes: [
            "id",
            "fullName",
            "birthDate",
            "gender",
            "address",
            "state",
            "country",
            "profileImage",
            "isActive",
        ],
        where: {
            isActive: whereCondition,
        },
        order: [["fullName", "ASC"]],
    }).catch((err: any) => {
        log.error(err, "Error while getUser")
        throw err
    })
    return users
}

const getUserById = async (id: number) => {
    const user = await customerDB.User.findOne({
        attributes: [
            "id",
            "fullName",
            "birthDate",
            "gender",
            "address",
            "state",
            "country",
            "profileImage",
            "isActive",
        ],
        include: [
            {
                model: customerDB.UserLogin,
                attributes: ["email", "roleId"],
            },
        ],
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getuserById")
        throw err
    })
    const _user: any = user?.toJSON()
    const { user_login, ...rest } = _user
    return {
        ...rest,
        email: user_login.email,
        roleId: user_login.roleId,
    }
}

/*
 * Update Industry Details
 */
interface UpdateUserParam {
    id: number
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
    address: string
    state: string
    country: string
    profileImage: string
    isActive: boolean
    roleId: number
    email: string
}
const updateUserById = async (param: UpdateUserParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const user = await customerDB.User.findOne({
            where: { id: param.id },
        })
        let updateUserDetails = null
        if (user) {
            user.fullName = param.fullName
            user.birthDate = param.birthDate || null
            user.gender = param.gender
            user.address = param.address
            user.state = param.state
            user.country = param.country
            user.isActive = param.isActive
            updateUserDetails = await user.save()
        }
        {
            transaction
        }
        const userLoginDetails = await customerDB.UserLogin.findOne({
            where: { userId: param.id },
        })
        let updateUserLoginDetails = null
        if (userLoginDetails) {
            if (param.roleId) userLoginDetails.roleId = param.roleId
            if (param.email) userLoginDetails.email = param.email
            updateUserLoginDetails = await userLoginDetails.save()
        }
        {
            transaction
        }
        await transaction.commit()
        return Object.assign({ updateUserDetails, updateUserLoginDetails })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while updateUserById")
        throw err
    }
}

const createResetPasswordToken = async (email: string) => {
    const t = await ormCustomer.transaction()
    try {
        const user = await customerDB.UserLogin.findOne({
            include: [
                {
                    model: customerDB.User,
                    attributes: ["fullName"],
                },
            ],
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
            transaction: t,
        })
        if (user) {
            const _user: any = user.toJSON()
            const token = crypto.randomBytes(32).toString("hex")
            user.resetToken = token
            user.resetExpires = moment(Date.now() + 3600000).toDate()
            await user.save({ transaction: t })
            await t.commit()

            const html = mjml(
                emailTemplate.generateForgotPasswordEmail({
                    fullName: _user.user_master.fullName,
                    email: _user.email,
                    token,
                })
            ).html
            mailer
                .sendMail({
                    to: [_user.email],
                    from: `"Field Hero" <no-reply@fieldhero.in>`,
                    subject: "Reset Password Request",
                    html,
                })
                .catch((err) => {
                    log.error(
                        err.message,
                        "Error in nodemailer while createResetPasswordToken"
                    )
                })
            return {
                status: true,
                code: httpStatus.OK,
                data: null,
                message: "Password reset request has been sent on your email.",
            }
        } else {
            return {
                status: false,
                code: httpStatus.Not_Found,
                message: "Email not found",
            }
        }
    } catch (error) {
        t.rollback()
        log.error("Error while createResetPasswordToken", error.message)
        return {
            status: false,
            code: httpStatus.Bad_Request,
            message: "Error while createResetPasswordToken",
        }
    }
}

const resetPasswordForUser = async (token: string, email: string) => {
    const t = await ormCustomer.transaction()
    try {
        const userLogin = await customerDB.UserLogin.findOne({
            include: [
                {
                    model: customerDB.User,
                    attributes: ["fullName"],
                },
            ],
            where: {
                email: {
                    [Op.eq]: email,
                },
            },
            transaction: t,
        })
        if (userLogin) {
            const _userLogin: any = userLogin.toJSON()
            if (_userLogin.resetToken === token) {
                const isTokenValid = moment(_userLogin.resetExpires).isAfter(
                    moment()
                )
                if (isTokenValid) {
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
                    userLogin.resetToken = null
                    userLogin.resetExpires = null
                    userLogin.passwordHash = newPasswordHash
                    await userLogin.save({ transaction: t })
                    await t.commit()
                    const html = mjml(
                        emailTemplate.generateResetPasswordSuccessEmail({
                            fullName: _userLogin.user_master.fullName,
                            password: newPassword,
                        })
                    ).html
                    mailer
                        .sendMail({
                            to: [_userLogin.email],
                            from: `"Field Hero" <no-reply@fieldhero.in>`,
                            subject: "Password Reset Successfully",
                            html,
                        })
                        .catch((err) => {
                            log.error(
                                err.message,
                                "Error in nodemailer while resetPasswordForUser"
                            )
                        })
                    return {
                        status: true,
                        code: httpStatus.OK,
                        message:
                            "Password reset successfully. New password has been sent on your email.",
                        data: null,
                    }
                } else {
                    return {
                        status: false,
                        code: httpStatus.Bad_Request,
                        message:
                            "Token expired. Please request reset password again.",
                    }
                }
            } else {
                return {
                    status: false,
                    code: httpStatus.Bad_Request,
                    message: "Token mismatch.",
                }
            }
        } else {
            return {
                status: false,
                code: httpStatus.Bad_Request,
                message: "Email not found.",
            }
        }
    } catch (error) {
        await t.rollback()
        log.error("Error while resetPasswordForUser", error.message)
        return {
            status: false,
            code: httpStatus.Bad_Request,
            message: "Error while resetPasswordForUser",
        }
    }
}

const User = {
    createUser,
    getUser,
    getUserById,
    updateUserById,
    createResetPasswordToken,
    resetPasswordForUser,
}
export { User }
