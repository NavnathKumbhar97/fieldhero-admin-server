import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const SubscriptionRouter = Router()

//* Create SubScripition Plan
SubscriptionRouter.post(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_create),
    async (req: Request, res: Response) => {
        try {
            const subscription = await handler.Subscription.createSubscripition(
                {
                    ...req.body,
                }
            )
            if (subscription == null) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Plan name already exits",
                })
            } else {
                res.status(httpStatus.Created).json(subscription)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch All Subscription List
SubscriptionRouter.get(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_read_all),
    async (req: Request, res: Response) => {
        try {
            const subscriptions = await handler.Subscription.getSubscriptions(
                req.query.all
            )
            if (!subscriptions.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(subscriptions)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Subscription By Id
SubscriptionRouter.get(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_read),
    async (req: Request<any>, res: Response) => {
        try {
            const subscription = await handler.Subscription.getSubscriptionById(
                req.params.id
            )
            if (subscription == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(subscription)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update subscription
SubscriptionRouter.put(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_update),
    async (req: Request<any>, res: Response) => {
        try {
            const subscription = await handler.Subscription.updatedSubscriptionById(
                {
                    id: req.params.id,
                    ...req.body,
                }
            )
            res.status(httpStatus.OK).json(subscription)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { SubscriptionRouter }
