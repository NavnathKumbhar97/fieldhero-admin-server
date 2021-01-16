import { Router, Request, Response, NextFunction } from "express"
import * as middleware from "./middleware"
import { Permission } from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const PermissionRouter = Router()

// Permissions

//* Fetch all Permissions

PermissionRouter.get(
    "/permissions",
    middleware.permission(helper.permissions.permission_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Permission.getPermissions(req.query.all)
            .then((permissions) => {
                if (!permissions.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(permissions)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Fetch Industry By Id

PermissionRouter.get(
    "/permissions/:id",
    middleware.permission(helper.permissions.permission_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Permission.getPermissionsById(req.params.id)
            .then((permission) => {
                if (permission == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(permission)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

export { PermissionRouter }
