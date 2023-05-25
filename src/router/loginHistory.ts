
import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import middleware from "./middleware"

const userLoginHistory = Router()

//* fetch category by id
userLoginHistory.get(
    "/user-history/:userLoginId",
    middleware.permission(helper.permissions.user_login_activity_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.loginHistory.fetchById(
                parseInt(req.params.userLoginId),
                // Number(req.query.take),
                // Number(req.query.skip),
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

userLoginHistory.get(
    "/admin-user-activity/:userLoginId",
    middleware.permission(helper.permissions.admin_user_login_activity_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.loginHistory.fetchById(
                parseInt(req.params.userLoginId),
                // Number(req.query.take),
                // Number(req.query.skip),
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)


//* Create Category
userLoginHistory.post(
    "/user-history",
    middleware.permission(helper.permissions.category_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.loginHistory.create(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { userLoginHistory }
