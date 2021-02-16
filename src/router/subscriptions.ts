import { Router, Request, Response, NextFunction } from "express"
import { Subscription } from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus, log } = helper

const SubscriptionRouter = Router()

// Subscription

//* Create SubScripition Plan

SubscriptionRouter.post(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_create),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const subscription = await Subscription.createSubscripition({
                ...req.body,
            })
            if (subscription == null) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Plan name already exits",
                })
            } else {
                res.status(httpStatus.Created).json(subscription)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                message: error.message,
            })
        }
    }
)

//* Fetch All Subscription List

SubscriptionRouter.get(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Subscription.getSubscriptions(req.query.all)
            .then((subscriptions) => {
                if (!subscriptions.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(subscriptions)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

//* Fetch Subscription By Id
SubscriptionRouter.get(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Subscription.getSubscriptionById(req.params.id)
            .then((subscription) => {
                if (subscription == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(subscription)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

// * Update subscription
SubscriptionRouter.put(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_update),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Subscription.updatedSubscriptionById({ id: req.params.id, ...req.body })
            .then((subscription) =>
                res.status(httpStatus.OK).json(subscription)
            )
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

export { SubscriptionRouter }
