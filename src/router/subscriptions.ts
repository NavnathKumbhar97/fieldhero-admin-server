import { Router, Request, Response, NextFunction } from "express"
import { httpStatus } from "../helper"
import { Subscription } from "../handlers"


const SubscriptionRouter = Router()

// Subscription

//* Create SubScripition Plane 

SubscriptionRouter.post(
    "/subscriptions",
    (req:Request, res:Response, next:NextFunction) => {
    Subscription.createSubscripition({ ...req.body })
        .then((subscription) => {
            if(subscription == null ){
                res.status(httpStatus.Conflict).json({"Success":"Plan Name Already Exits"})
            }
            res.status(httpStatus.Created).json(subscription)
        })
        .catch((err) => {
            console.log(err)
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request, 
                error: err 
            })
        })
})

//* Fetch All Subscription List

SubscriptionRouter.get(
    "/subscriptions",
    (req:Request, res:Response, next:NextFunction) => {
        Subscription.getSubscriptions(req.query.all)
        .then((subscriptions)=>{
            if(!subscriptions.length){
                res.sendStatus(httpStatus.No_Content)
            }
            res.status(httpStatus.OK).json(subscriptions)
        }).catch((err)=>{
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        })
})

//* Fetch Subscription By Id 

interface GetSubscriptionByIdParam {
    id: number
}
SubscriptionRouter.get(
    "/subscriptions/:id", 
    (req:Request<GetSubscriptionByIdParam>, res:Response, next:NextFunction) => {
    Subscription
        .getSubscriptionById(req.params.id)
        .then((subscription) => {
            if(subscription == null){
                res.sendStatus(httpStatus.No_Content)
            }
            res.status(httpStatus.OK).json(subscription)
        })
        .catch((err) => res.status(httpStatus.Bad_Request).json({ 
            code: httpStatus.Bad_Request, 
            error: err 
        })
    )
})

// Inactive Subscriptions By id 
interface InactiveByIdParam {
    id: number
}
SubscriptionRouter.put(
    "/subscriptions/:id",
    (req:Request<InactiveByIdParam>, res:Response, next:NextFunction) => {
    Subscription.updatedSubscriptionById(req.params.id)
        .then((subscription) => 
            res.status(httpStatus.OK).json(subscription)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

export { SubscriptionRouter }
