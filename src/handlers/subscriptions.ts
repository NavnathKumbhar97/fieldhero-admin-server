// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper

/*
 * get All Subscription Plan Details
 */
const getSubscriptions = async (
    all: string
): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const subscriptions = await prisma.subscription.findMany({
            select: {
                id: true,
                planName: true,
                dataCount: true,
                durationMonths: true,
                price: true,
                note: true,
                isActive: true,
            },
            where: {
                isActive: whereCondition,
            },
            orderBy: {
                planName: "asc",
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            subscriptions
        )
    } catch (error) {
        log.error(error.message, "Error while getSubscriptions")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getSubscriptions"
        )
    }
}

/*
 * get All Subscription Plans By Id
 */
const getSubscriptionById = async (
    id: number
): Promise<helper.IResponseObject> => {
    try {
        const subscripition = await prisma.subscription.findFirst({
            where: {
                id,
            },
        })
        if (!subscripition)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Industry not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            subscripition
        )
    } catch (error) {
        log.error(error.message, "Error while getSubscriptionById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getSubscriptionById"
        )
    }
}

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

const createSubscripition = async (
    userLoginId: number,
    param: createSubscripitionParam
): Promise<helper.IResponseObject> => {
    try {
        const subscriptionFound = await prisma.subscription.findFirst({
            where: {
                planName: param.planName,
            },
        })
        if (subscriptionFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Plan name already exist"
            )

        const subscripition = await prisma.subscription.create({
            data: {
                planName: param.planName,
                dataCount: param.dataCount,
                durationMonths: param.durationMonths,
                price: param.price,
                note: param.note,
                isActive: "isActive" in param ? param.isActive : undefined,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Subscription created successfully",
            subscripition
        )
    } catch (error) {
        log.error(error.message, "Error while createSubscripition")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createSubscripition"
        )
    }
}

/*
 * Update subscription
 */
interface IUpdateSubscriptionParam {
    id: number
    note: string
    isActive: boolean
}

const updatedSubscriptionById = async (
    userLoginId: number,
    param: IUpdateSubscriptionParam
): Promise<helper.IResponseObject> => {
    try {
        const subscriptionFound = await prisma.subscription.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!subscriptionFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Subscription not found"
            )

        const subscripition = await prisma.subscription.update({
            where: {
                id: param.id,
            },
            data: {
                note: param.note,
                isActive: "isActive" in param ? param.isActive : undefined,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Subscription updated successfully",
            subscripition
        )
    } catch (error) {
        log.error(error.message, "Error while updatedSubscriptionById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updatedSubscriptionById"
        )
    }
}

const Subscription = {
    getSubscriptions,
    createSubscripition,
    getSubscriptionById,
    updatedSubscriptionById,
}
export { Subscription }
