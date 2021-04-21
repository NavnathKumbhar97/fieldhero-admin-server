import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"

const IndustryRouter = Router()
// Industry

//* Fetch all Industry
IndustryRouter.get(
    "/industries",
    middleware.permission(helper.permissions.industry_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Industry.getIndustries(
                req.query.all as string
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Industry By Id
IndustryRouter.get(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Industry.getIndustryById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Industry
IndustryRouter.post(
    "/industries",
    middleware.permission(helper.permissions.industry_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Industry.createIndustry(
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

//* Update Industry
IndustryRouter.put(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Industry.updateIndustryById(
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

export { IndustryRouter }
