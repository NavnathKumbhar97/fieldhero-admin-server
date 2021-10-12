import { Router, Request, Response } from "express"
// local imports
import helper from "../helper"
import handler from "../handlers"
import middleware from "./middleware"

const BatchPriorityRouter = Router()

// * create batch priority
BatchPriorityRouter.post(
    "/batch-priorities",
    middleware.permission(helper.permissions.batch_priority_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.BatchPriority.update(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, message, data } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch all batch priorities
BatchPriorityRouter.get(
    "/batch-priorities",
    middleware.permission(helper.permissions.batch_priority_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.BatchPriority.fetchAll()
            const { code, message, data } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//
BatchPriorityRouter.get(
    "/batch-priorities/passive-create",
    middleware.permission(helper.permissions.batch_priority_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.BatchPriority.passiveCreate()
            const { code, message, data } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch batch priority by id
BatchPriorityRouter.get(
    "/batch-priorities/:id",
    middleware.permission(helper.permissions.batch_priority_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.BatchPriority.fetchById(
                parseInt(req.params.id)
            )
            const { code, message, data } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export default BatchPriorityRouter
export { BatchPriorityRouter }
