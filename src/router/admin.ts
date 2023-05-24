import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import { permissions, getUserLoginId } from "../helper"
import middleware from "./middleware"

const AdminRouter = Router()

// fetch all other industries categories
AdminRouter.get(
    "/admin/other-industries-categories",
    middleware.permission(permissions.admin_other_industry_category_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Admin.fetchOtherIndustriesCategories()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// fetch passive for other industries categories
AdminRouter.get(
    "/admin/other-industries-categories/passive",
    middleware.permission(permissions.admin_other_industry_category_read_all),

    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.Admin.fetchOtherIndustriesCategoriesPassive()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// update other industry category
AdminRouter.post(
    "/admin/other-industries-categories",
    middleware.permission(permissions.admin_other_industry_category_update),
    
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Admin.updateOtherIndustriesCategories(
                getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { AdminRouter }
