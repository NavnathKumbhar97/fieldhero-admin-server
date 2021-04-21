import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"

const CustomerRouter = Router()

// * Fetch all customers
CustomerRouter.get(
    "/customers",
    middleware.permission(helper.permissions.customer_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.getCustomers(req.query.all as string)
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch customer by id
CustomerRouter.get(
    "/customers/:id",
    middleware.permission(helper.permissions.customer_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.getCustomerById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update customer
CustomerRouter.put(
    "/customers/:id",
    middleware.permission(helper.permissions.customer_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.updateCustomer(
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

// * fetch customer subscriptions
CustomerRouter.get(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.getCustomerSubscriptions(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Create customer subscription
CustomerRouter.post(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.createCustomerSubscription(
                helper.getUserLoginId(req.user),
                {
                    customerId: parseInt(req.params.id),
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

// * fetch customer subscriptions By Subscrition Id
CustomerRouter.get(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.getCustomerSubscriptionsById(
                parseInt(req.params.id),
                parseInt(req.params.subId)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update Customer Subscription Plan By subscrition Id
CustomerRouter.put(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.updateCustomerSubscriptionsById(
                helper.getUserLoginId(req.user),
                {
                    customerId: req.params.id,
                    id: req.params.subId,
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

// * Reset customer password for login
CustomerRouter.post(
    "/customers/:id/reset-password",
    middleware.permission(helper.permissions.customer_reset_password),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Customer.resetLoginPasswordForCustomer(
                helper.getUserLoginId(req.user),
                {
                    id: parseInt(req.params.id),
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CustomerRouter }
