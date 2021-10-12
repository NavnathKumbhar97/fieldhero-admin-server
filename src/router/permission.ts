import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"

const PermissionRouter = Router()

//* Fetch all Permissions
PermissionRouter.get(
    "/permissions",
    middleware.permission(helper.permissions.permission_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Permission.getPermissions(
                req.query.all as string
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Permission By Id
PermissionRouter.get(
    "/permissions/:id",
    middleware.permission(helper.permissions.permission_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Permission.getPermissionsById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { PermissionRouter }
