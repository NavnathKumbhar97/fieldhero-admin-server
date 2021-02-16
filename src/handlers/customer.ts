import { Op } from "sequelize"
import generator from "generate-password"
import bcrypt from "bcrypt"
import mjml from "mjml"
// local imports
import { customerDB, ormCustomer } from "../sequelize"
import { log, httpStatus } from "../helper"
import { emailTemplate } from "../handlers"
import * as config from "../config"
import mailer from "../../nodemailer"
import { custom } from "joi"

// * Get all customers
const getCustomers = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    try {
        const customers = await customerDB.Customer.findAll({
            attributes: [
                "id",
                "fullName",
                "companyName",
                "birthDate",
                "gender",
                "state",
                "country",
                "profileImage",
                "isActive",
            ],
            where: {
                isActive: whereCondition,
            },
            include: {
                model: customerDB.CustomerLogin,
                attributes: ["email"],
            },
        })

        return customers.map((cust) => {
            const { customer_login, ...other } = cust.toJSON() as any
            return { ...other, email: customer_login.email }
        })
    } catch (error) {
        log.error(error, "Error while getCustomers")
        throw error
    }
}

// * Get customer by id
const getCustomerById = async (id: number) => {
    try {
        const customer = await customerDB.Customer.findOne({
            attributes: [
                "id",
                "fullName",
                "companyName",
                "birthDate",
                "gender",
                "state",
                "country",
                "profileImage",
                "isActive",
            ],
            where: {
                id,
            },
            include: {
                model: customerDB.CustomerLogin,
                attributes: ["email"],
            },
        })
        if (customer) {
            const { customer_login, ...other } = customer.toJSON() as any
            return { ...other, email: customer_login.email }
        }
        return null
    } catch (error) {
        log.error(error, "Error while getCustomerById")
        throw error
    }
}

const getCustomerSubscriptions = async (id: number) => {
    try {
        const customer = await customerDB.Customer.findOne({
            attributes: ["id"],
            where: { id },
        })
        if (customer) {
            const custSubscriptions = await customerDB.CustomerSubscription.findAll(
                {
                    where: {
                        customerId: customer.id,
                    },
                }
            )
            if (custSubscriptions.length) {
                const _custSubscriptions = custSubscriptions.map((x) =>
                    x.toJSON()
                )
                return _custSubscriptions
            }
        }
        return null
    } catch (error) {
        log.error(error, "Error while getCustomerSubscriptions")
        throw error
    }
}

/**
 *  Get CusomerSubscrtion By SubscriptionById
 * @param id
 * @param subId
 */

const getCustomerSubscriptionsById = async (id: number, subId: number) => {
    try {
        const customer = await customerDB.Customer.findOne({
            attributes: ["id"],
            where: { id },
        })
        if (customer) {
            const custSubscription = await customerDB.CustomerSubscription.findAll(
                {
                    where: {
                        customerId: customer.id,
                        id: subId,
                    },
                }
            )
            if (custSubscription) {
                return custSubscription
            }
        }
        return null
    } catch (error) {
        log.error(error, "Error while getCustomerSubscriptionById")
        throw error
    }
}

interface ICustomerSubscriptionParam {
    customerId: number
    planName: string
    startDate: Date
    expiryDate: Date
    allocatedData: number
    status: string
    comment?: string
}
const createCustomerSubscription = async (
    param: ICustomerSubscriptionParam
) => {
    try {
        const customerSubscription = await customerDB.CustomerSubscription.create(
            {
                planName: param.planName,
                startDate: param.startDate,
                expiryDate: param.expiryDate,
                allocatedData: param.allocatedData,
                usedData: 0,
                status: param.status,
                comment: param.comment ? param.comment : null,
                customerId: param.customerId,
            }
        )
        return customerSubscription
    } catch (error) {
        log.error(error, "Error while createCustomerSubscription")
        throw error
    }
}

interface updateSubScriptionParam {
    id: number
    customerId: number
    planName: string
    startDate: Date
    expiryDate: Date
    allocatedData: number
    status: string
    comment?: string
}

const updateCustomerSubscriptionsById = async (
    param: updateSubScriptionParam
) => {
    try {
        const customer = await customerDB.Customer.findOne({
            attributes: ["id"],
            where: { id: param.customerId },
        })
        if (customer) {
            const custSubscription = await customerDB.CustomerSubscription.findAll(
                {
                    where: {
                        customerId: customer.id,
                        id: param.id,
                    },
                }
            )
            const updateSubScription = null
            if (custSubscription) {
                (custSubscription[0].planName = param.planName),
                    (custSubscription[0].startDate = param.startDate),
                    (custSubscription[0].expiryDate = param.expiryDate),
                    (custSubscription[0].allocatedData = param.allocatedData),
                    (custSubscription[0].status = param.status),
                    (custSubscription[0].comment = param.comment)

                const updateSubScription = await custSubscription[0].save()

                return updateSubScription
            }
        }
        return null
    } catch (error) {
        log.error(error, "Error while updateCustomerSubscriptionsById")
        throw error
    }
}

const resetLoginPasswordForCustomer = async (param: any) => {
    const t = await ormCustomer.transaction()
    try {
        const customerLogin = await customerDB.CustomerLogin.findOne({
            include: [
                {
                    model: customerDB.Customer,
                    attributes: ["fullName"],
                },
            ],
            where: {
                customerId: {
                    [Op.eq]: param.id,
                },
            },
            transaction: t,
        })
        if (customerLogin) {
            const _customerLogin: any = customerLogin.toJSON()
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
            customerLogin.passwordHash = newPasswordHash
            await customerLogin.save({ transaction: t })
            await t.commit()
            const html = mjml(
                emailTemplate.generateResetPasswordByAdminSuccessEmail({
                    fullName: _customerLogin.customer_master.fullName,
                    password: newPassword,
                })
            ).html
            mailer
                .sendMail({
                    to: [_customerLogin.email],
                    from: `"Field Hero" <no-reply@fieldhero.in>`,
                    subject: "Password Reset Successfully",
                    html,
                })
                .catch((err) => {
                    log.error(
                        err.message,
                        "Error in nodemailer while resetLoginPasswordForCustomer"
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
                message: "Customer not found",
            }
        }
    } catch (error) {
        await t.rollback()
        log.error(error, "error while resetLoginPasswordForCustomer")
        throw error
    }
}

interface IUpdateCustomerparam {
    id: number
    fullName: string
    companyName: string
    birthDate: Date
    gender: string
    state: string
    country: string
}
const updateCustomer = async (param: IUpdateCustomerparam) => {
    const t = await ormCustomer.transaction()
    try {
        const customer = await customerDB.Customer.findOne({
            where: {
                id: param.id,
            },
            transaction: t,
        })
        if (customer) {
            if (param.fullName) customer.fullName = param.fullName
            customer.companyName = param.companyName
            customer.birthDate = param.birthDate
            customer.gender = param.gender
            customer.state = param.state
            customer.country = param.country
            await customer.save({ transaction: t })
            await t.commit()
            return {
                status: true,
                code: httpStatus.No_Content,
                message: `Customer updated successfully`,
                data: null,
            }
        } else {
            return {
                status: false,
                code: httpStatus.Bad_Request,
                message: "Customer not found",
            }
        }
    } catch (error) {
        await t.rollback()
        log.error(error, "error while updateCustomer")
        throw error
    }
}

const Customer = {
    getCustomers,
    getCustomerById,
    getCustomerSubscriptions,
    createCustomerSubscription,
    getCustomerSubscriptionsById,
    updateCustomerSubscriptionsById,
    resetLoginPasswordForCustomer,
    updateCustomer,
}

export { Customer }
