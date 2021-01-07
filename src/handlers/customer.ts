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
        //console.log(err)
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
        //console.log(err)
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
        //console.log(err)
        throw error
    }
}

const Customer = { getCustomers, getCustomerById, getCustomerSubscriptions }

export { Customer }
