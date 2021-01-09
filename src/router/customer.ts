import { Router, Request, Response, NextFunction } from "express"
import { httpStatus } from "../helper"
import { Customer } from "../handlers"

const CustomerRouter = Router()

// * Fetch all customers
CustomerRouter.get(
    "/customers",
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
interface IGetCustomerByIdParam {
    id: number
}
CustomerRouter.get(
    "/customers/:id",
    (
        req: Request<IGetCustomerByIdParam>,
        res: Response,
        next: NextFunction
    ) => {
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
interface IGetCustomerSubscriptionsParam {
    id: number
}
CustomerRouter.get(
    "/customers/:id/subscriptions",
    (
        req: Request<IGetCustomerSubscriptionsParam>,
        res: Response,
        next: NextFunction
    ) => {
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
interface ICreateCustomerSubscriptionParam {
    id: number
}
CustomerRouter.post(
    "/customers/:id/subscriptions",
    (
        req: Request<ICreateCustomerSubscriptionParam>,
        res: Response,
        next: NextFunction
    ) => {
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
interface IGetCustomerSubscriptionsParam {
    id: number,
    subId:number 
}
CustomerRouter.get(
    "/customers/:id/subscription/:subId",
    (
        req: Request<IGetCustomerSubscriptionsParam>,
        res: Response,
        next: NextFunction
    ) => {
        Customer.getCustomerSubscriptionsById(req.params.id,req.params.subId )
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
