import generator from "generate-password"
import bcrypt from "bcrypt"
import mjml from "mjml"
// local imports
import * as helper from "../helper"
import { emailTemplate } from "../handlers"
import * as config from "../config"
import mailer from "../../nodemailer"
import prisma from "../prisma"
import logger from "../logs"
import path from "path"

const { log, httpStatus } = helper

// * Get all customers
const getCustomers = async (all: string,take:any,skip:any): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.customer.count({
            where: {
                createdBy: undefined,
            },
        })


        const customers = await prisma.customer.findMany({take:limit,skip:page,
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
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCustomers | Message: Customer fetched successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {result,count})
    } catch (error: any) {
        log.error(error.message, "Error while getCustomers")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCustomers | Message: Error while getCustomers.`);
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

        if (!customer){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : getCustomerById | Message: Customer not found.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
                )
            }

        const { CustomerLogin, ...other } = customer
        const result = { ...other, email: CustomerLogin?.email }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCustomerById | Message: Customer fetched by id successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error: any) {
        log.error(error.message, "Error while getCustomerById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCustomerById | Message: Error while getCustomerById.`);
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
        const customerSubscriptions =
            await prisma.customerSubscription.findMany({
                where: {
                    customerId,
                },
            })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCustomerSubscriptions | Message: Get Customer Subscriptions fetched by id successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            customerSubscriptions
        )
    } catch (error: any) {
        log.error(error.message, "Error while getCustomerSubscriptions")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCustomerSubscriptions | Message: Error while getCustomerSubscriptions.`);

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
        const customerSubscription =
            await prisma.customerSubscription.findFirst({
                where: {
                    customerId,
                    id: subscriptionId,
                },
            })
        if (!customerSubscription){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : getCustomerSubscriptionsById | Message: Customer subscription not found.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer subscription not found"
                )
            }
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : getCustomerSubscriptionsById | Message: Get Customer Subscriptions By Id.`);
        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            customerSubscription
        )
    } catch (error: any) {
        log.error(error.message, "Error while getCustomerSubscriptionsById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getCustomerSubscriptionsById | Message: Error while getCustomerSubscriptionsById.`);
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
    } catch (error: any) {
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

        const customerSubscription =
            await prisma.customerSubscription.updateMany({
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
            })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Customer subscription updated successfully",
            customerSubscription
        )
    } catch (error: any) {
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

        const _template =
            emailTemplate.generateResetPasswordByAdminSuccessEmail({
                fullName: customerLogin.CustomerId.fullName,
                password: newPassword,
            })
        const html = mjml(_template.template).html
        helper.Email.sendEmail(
            _template.id,
            html,
            customerLogin.email,
            "FieldHero Customer - Password Reset Successfully"
        )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Password reset successfully. New password has been sent on your email"
        )
    } catch (error: any) {
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
        {
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : updateCustomer | Message: Customer not found.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Customer not found"
                )
            }

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
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateCustomer | Message: Customer updated successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Customer updated successfully",
            customer
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateCustomer")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateCustomer | Message: Error while updateCustomer.`);
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
