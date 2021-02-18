import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const CustomerRouter = Router()

// * Fetch all customers
CustomerRouter.get(
    "/customers",
    middleware.permission(helper.permissions.customer_read_all),
    async (req: Request, res: Response) => {
        try {
            const customers = await handler.Customer.getCustomers(req.query.all)
            if (!customers.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(customers)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch customer by id
CustomerRouter.get(
    "/customers/:id",
    middleware.permission(helper.permissions.customer_read),
    async (req: Request<any>, res: Response) => {
        try {
            const customer = await handler.Customer.getCustomerById(
                req.params.id
            )
            if (!customer) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(customer)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update customer
CustomerRouter.put(
    "/customers/:id",
    middleware.permission(helper.permissions.customer_update),
    async (req: Request<any>, res: Response) => {
        try {
            const response = await handler.Customer.updateCustomer({
                id: req.params.id,
                ...req.body,
            })
            if (response) {
                const { code, message, status, data } = response
                if (status) {
                    res.status(code).json({
                        message,
                        data,
                    })
                } else {
                    res.status(code).json({
                        message,
                    })
                }
            } else {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                })
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch customer subscriptions
CustomerRouter.get(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_read_all),
    async (req: Request<any>, res: Response) => {
        try {
            const subscriptions = await handler.Customer.getCustomerSubscriptions(
                req.params.id
            )
            if (subscriptions && subscriptions.length) {
                res.status(httpStatus.OK).json(subscriptions)
            } else {
                res.sendStatus(httpStatus.No_Content)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Create customer subscription
CustomerRouter.post(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_create),
    async (req: Request<any>, res: Response) => {
        try {
            const cust_subscription = await handler.Customer.createCustomerSubscription(
                {
                    customerId: req.params.id,
                    ...req.body,
                }
            )
            res.status(httpStatus.Created).json(cust_subscription)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch customer subscriptions By Subscrition Id
CustomerRouter.get(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_read),
    async (req: Request<any>, res: Response) => {
        try {
            const custSubscription = await handler.Customer.getCustomerSubscriptionsById(
                req.params.id,
                req.params.subId
            )
            if (custSubscription) {
                res.status(httpStatus.OK).json(custSubscription)
            } else {
                res.sendStatus(httpStatus.No_Content)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update Customer Subscription Plan By subscrition Id
CustomerRouter.put(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_update),
    async (req: Request<any>, res: Response) => {
        try {
            const custSubscription = await handler.Customer.updateCustomerSubscriptionsById(
                {
                    customerId: req.params.id,
                    id: req.params.subId,
                    ...req.body,
                }
            )
            if (custSubscription) {
                res.status(httpStatus.OK).json(custSubscription)
            } else {
                res.sendStatus(httpStatus.No_Content)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Reset customer password for login
CustomerRouter.post(
    "/customers/:id/reset-password",
    middleware.permission(helper.permissions.customer_reset_password),
    async (req: Request<any>, res: Response) => {
        try {
            const response = await handler.Customer.resetLoginPasswordForCustomer(
                {
                    id: req.params.id,
                }
            )
            if (response) {
                const { code, message, status, data } = response
                if (status) {
                    res.status(code).json({
                        message,
                        data,
                    })
                } else {
                    res.status(code).json({
                        message,
                    })
                }
            } else {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                })
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CustomerRouter }
