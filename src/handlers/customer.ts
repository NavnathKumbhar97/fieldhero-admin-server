import generator from "generate-password"
import bcrypt from "bcrypt"
import mjml from "mjml"
// local imports
import * as helper from "../helper"
import { emailTemplate } from "../handlers"
import * as config from "../config"
import mailer from "../../nodemailer"
import prisma from "../prisma"

const { log, httpStatus } = helper

// * Get all customers
const getCustomers = async (all: string): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const customers = await prisma.customer.findMany({
            where: {
                isActive: whereCondition,
            },
            select: {
                id: true,
                fullName: true,
                companyName: true,
                dob: true,
                gender: true,
                state: true,
                country: true,
                profileImage: true,
                isActive: true,
                CustomerLogin: {
                    select: {
                        email: true,
                    },
                },
            },
            orderBy: {
                fullName: "asc",
            },
        })
        const result = customers.map((cust) => {
            const { CustomerLogin, ...rest } = cust
            return { ...rest, email: CustomerLogin?.email }
        })

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getCustomers")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCustomers"
        )
    }
}

// * Get customer by id
const getCustomerById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const customer = await prisma.customer.findFirst({
            where: { id },
            select: {
                id: true,
                fullName: true,
                companyName: true,
                dob: true,
                gender: true,
                state: true,
                country: true,
                profileImage: true,
                isActive: true,
                CustomerLogin: {
                    select: {
                        email: true,
                    },
                },
            },
        })

        if (!customer)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
            )

        const { CustomerLogin, ...other } = customer
        const result = { ...other, email: CustomerLogin?.email }

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getCustomerById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCustomerById"
        )
    }
}

const getCustomerSubscriptions = async (
    customerId: number
): Promise<helper.IResponseObject> => {
    try {
        const customerSubscriptions = await prisma.customerSubscription.findMany(
            {
                where: {
                    customerId,
                },
            }
        )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            customerSubscriptions
        )
    } catch (error) {
        log.error(error.message, "Error while getCustomerSubscriptions")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCustomerSubscriptions"
        )
    }
}

/**
 *  Get CusomerSubscrtion By SubscriptionById
 * @param id
 * @param subId
 */

const getCustomerSubscriptionsById = async (
    customerId: number,
    subscriptionId: number
): Promise<helper.IResponseObject> => {
    try {
        const customerSubscription = await prisma.customerSubscription.findFirst(
            {
                where: {
                    customerId,
                    id: subscriptionId,
                },
            }
        )
        if (!customerSubscription)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer subscription not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            customerSubscription
        )
    } catch (error) {
        log.error(error.message, "Error while getCustomerSubscriptionsById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getCustomerSubscriptionsById"
        )
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
    userLoginId: number,
    param: ICustomerSubscriptionParam
): Promise<helper.IResponseObject> => {
    try {
        const customerFound = await prisma.customer.findFirst({
            where: {
                id: param.customerId,
            },
        })
        if (!customerFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
            )

        const customerSubscription = await prisma.customerSubscription.create({
            data: {
                planName: param.planName,
                startDate: param.startDate,
                expiryDate: param.expiryDate,
                allocatedData: param.allocatedData,
                usedData: 0,
                status: param.status,
                comment: param.comment,
                customerId: param.customerId,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Customer subscription created successfully",
            customerSubscription
        )
    } catch (error) {
        log.error(error.message, "Error while createCustomerSubscription")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createCustomerSubscription"
        )
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
    userLoginId: number,
    param: updateSubScriptionParam
): Promise<helper.IResponseObject> => {
    try {
        const customerFound = await prisma.customer.findFirst({
            where: {
                id: param.customerId,
            },
        })
        if (!customerFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
            )

        const customerSubscription = await prisma.customerSubscription.updateMany(
            {
                where: {
                    id: param.id,
                    customerId: param.customerId,
                },
                data: {
                    planName: param.planName,
                    startDate: param.startDate,
                    expiryDate: param.expiryDate,
                    allocatedData: param.allocatedData,
                    status: param.status,
                    comment: param.comment,
                    modifiedBy: userLoginId,
                },
            }
        )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Customer subscription updated successfully",
            customerSubscription
        )
    } catch (error) {
        log.error(error.message, "Error while updateCustomerSubscriptionsById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCustomerSubscriptionsById"
        )
    }
}

interface IResetLoginPasswordForCustomerParam {
    id: number
}

const resetLoginPasswordForCustomer = async (
    userLoginId: number,
    param: IResetLoginPasswordForCustomerParam
): Promise<helper.IResponseObject> => {
    try {
        const customerFound = await prisma.customer.findFirst({
            where: {
                id: param.id,
            },
            include: {
                CustomerLogin: true,
            },
        })
        if (!customerFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
            )

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

        const customerLogin = await prisma.customerLogin.update({
            where: {
                id: customerFound.CustomerLogin?.id,
            },
            data: {
                passwordHash: newPasswordHash,
                modifiedBy: userLoginId,
            },
            include: {
                CustomerId: {
                    select: {
                        fullName: true,
                    },
                },
            },
        })

        const html = mjml(
            emailTemplate.generateResetPasswordByAdminSuccessEmail({
                fullName: customerLogin.CustomerId.fullName,
                password: newPassword,
            })
        ).html
        mailer
            .sendMail({
                to: [customerLogin.email],
                from: config.EMAIL_FROM,
                subject: "Fieldhero Customer - Password Reset Successfully",
                html,
            })
            .catch((err) => {
                log.error(
                    err.message,
                    "Error in nodemailer while resetLoginPasswordForCustomer"
                )
            })
        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Password reset successfully. New password has been sent on your email"
        )
    } catch (error) {
        log.error(error.message, "Error while resetLoginPasswordForCustomer")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while resetLoginPasswordForCustomer"
        )
    }
}

interface IUpdateCustomerparam {
    id: number
    fullName: string
    companyName: string
    birthDate: Date
    gender: "MALE" | "FEMALE" | "OTHER" | null
    state: string
    country: string
}
const updateCustomer = async (
    userLoginId: number,
    param: IUpdateCustomerparam
): Promise<helper.IResponseObject> => {
    try {
        const customerFound = await prisma.customer.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!customerFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
            )

        const customer = await prisma.customer.update({
            where: {
                id: customerFound.id,
            },
            data: {
                fullName: param.fullName,
                companyName: param.companyName,
                dob: param.birthDate,
                gender: param.gender,
                state: param.state,
                country: param.country,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Customer updated successfully",
            customer
        )
    } catch (error) {
        log.error(error.message, "Error while updateCustomer")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCustomer"
        )
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
