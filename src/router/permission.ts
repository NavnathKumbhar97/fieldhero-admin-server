import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const PermissionRouter = Router()

//* Fetch all Permissions
PermissionRouter.get(
    "/permissions",
    middleware.permission(helper.permissions.permission_read_all),
    async (req: Request, res: Response) => {
        try {
            const permissions = await handler.Permission.getPermissions(
                req.query.all
            )
            if (!permissions.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(permissions)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Permission By Id
PermissionRouter.get(
    "/permissions/:id",
    middleware.permission(helper.permissions.permission_read),
    async (req: Request<any>, res: Response) => {
        try {
            const permission = await handler.Permission.getPermissionsById(
                req.params.id
            )
            if (permission == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(permission)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { PermissionRouter }
