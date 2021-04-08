import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"

const SubscriptionRouter = Router()

//* Fetch All Subscription List
SubscriptionRouter.get(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Subscription.getSubscriptions(
                req.query.all as string
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Subscription By Id
SubscriptionRouter.get(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Subscription.getSubscriptionById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create SubScripition Plan
SubscriptionRouter.post(
    "/subscriptions",
    middleware.permission(helper.permissions.subscription_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Subscription.createSubscripition(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update subscription
SubscriptionRouter.put(
    "/subscriptions/:id",
    middleware.permission(helper.permissions.subscription_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Subscription.updatedSubscriptionById(
                helper.getUserLoginId(req.user),
                {
                    id: parseInt(req.params.id),
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { SubscriptionRouter }
