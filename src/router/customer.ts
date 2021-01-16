import { Router, Request, Response, NextFunction } from "express"
import * as middleware from "./middleware"
import { Customer } from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const CustomerRouter = Router()

// * Fetch all customers
CustomerRouter.get(
    "/customers",
    middleware.permission(helper.permissions.customer_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Customer.getCustomers(req.query.all)
            .then((customers) => {
                if (!customers.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(customers)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * fetch customer by id

CustomerRouter.get(
    "/customers/:id",
    middleware.permission(helper.permissions.customer_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Customer.getCustomerById(req.params.id)
            .then((customer) => {
                if (!customer) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(customer)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * fetch customer subscriptions
CustomerRouter.get(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_read_all),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Customer.getCustomerSubscriptions(req.params.id)
            .then((subscriptions) => {
                if (subscriptions && subscriptions.length) {
                    res.status(httpStatus.OK).json(subscriptions)
                }
                res.sendStatus(httpStatus.No_Content)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * Create customer subscription
CustomerRouter.post(
    "/customers/:id/subscriptions",
    middleware.permission(helper.permissions.customer_subscription_create),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Customer.createCustomerSubscription({
            customerId: req.params.id,
            ...req.body,
        })
            .then((cust_subscription) => {
                res.status(httpStatus.Created).json(cust_subscription)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * fetch customer subscriptions By Subscrition Id
CustomerRouter.get(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Customer.getCustomerSubscriptionsById(req.params.id, req.params.subId)
            .then((custSubscription) => {
                if (custSubscription) {
                    res.status(httpStatus.OK).json(custSubscription)
                }
                res.sendStatus(httpStatus.No_Content)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * Update Customer Subscription Plan By subscrition Id
CustomerRouter.put(
    "/customers/:id/subscription/:subId",
    middleware.permission(helper.permissions.customer_subscription_update),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Customer.updateCustomerSubscriptionsById({
            customerId: req.params.id,
            id: req.params.subId,
            ...req.body,
        })
            .then((custSubscription) => {
                if (custSubscription) {
                    res.status(httpStatus.OK).json(custSubscription)
                }
                res.sendStatus(httpStatus.No_Content)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

export { CustomerRouter }
