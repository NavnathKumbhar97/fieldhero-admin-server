import { customerDB } from "../sequelize"
import { log } from "../helper"

/*
 * Create Subscripition Plan Details
 */
interface createSubscripitionParam {
    planName: string
    dataCount: number
    durationMonths: number
    price: number
    note: string
    isActive: boolean
}

const createSubscripition = async (param: createSubscripitionParam) => {
    const findSubscripition = await customerDB.Subscription.findOne({
        where: {
            planName: param.planName,
        },
    })
    if (findSubscripition) {
        return null
    } else {
        const subscription = await customerDB.Subscription.create({
            planName: param.planName,
            dataCount: param.dataCount,
            durationMonths: param.durationMonths,
            price: param.price,
            note: param.note ? param.note : null,
            isActive: param.isActive,
        }).catch((err) => {
            log.error(err, "Error while createSubscripition")
            //console.log(err)
            throw err
        })
        return subscription
    }
}

/*
 * get All Subscription Plan Details
 */
const getSubscriptions = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const subscriptions = await customerDB.Subscription.findAll({
        attributes: [
            "id",
            "planName",
            "dataCount",
            "durationMonths",
            "price",
            "note",
            "isActive",
        ],
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getSubscriptions")
        //console.log(err)
        throw err
    })
    return subscriptions
}

/*
 * get All Subscription Plans By Id
 */
const getSubscriptionById = async (id: number) => {
    const subscription = await customerDB.Subscription.findOne({
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getSubscriptionById")
        //console.log(err)
        throw err
    })
    return subscription
}

/*
 * Update subscription
 */
interface IUpdateSubscriptionParam {
    id: number
    note: string
    isActive: boolean
}

const updatedSubscriptionById = async (param: IUpdateSubscriptionParam) => {
    const subscripition = await customerDB.Subscription.findOne({
        where: { id: param.id },
    })
    let updatedsubscripition = null
    if (subscripition) {
        subscripition.isActive = param.isActive
            ? param.isActive
            : !subscripition.isActive
        if (param.note) subscripition.note = param.note
        updatedsubscripition = await subscripition.save().catch((err: any) => {
            log.error(err, "Error while updatedSubscriptionById")
            //console.log(err)
            throw err
        })
        return updatedsubscripition
    }
}

const Subscription = {
    getSubscriptions,
    createSubscripition,
    getSubscriptionById,
    updatedSubscriptionById,
}
export { Subscription }
