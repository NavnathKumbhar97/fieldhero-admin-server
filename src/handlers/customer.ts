import { customerDB } from "../sequelize"
import { log } from "../helper"

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

const Customer = {
    getCustomers,
    getCustomerById,
    getCustomerSubscriptions,
    createCustomerSubscription,
    getCustomerSubscriptionsById,
    updateCustomerSubscriptionsById,
}

export { Customer }
