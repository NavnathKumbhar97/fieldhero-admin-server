import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import * as middleware from "./middleware"
const { httpStatus } = helper
const RoleRouter = Router()

//* Fetch all Roles
RoleRouter.get(
    "/roles",
    middleware.permission(helper.permissions.role_read_all),
    async (req: Request, res: Response) => {
        try {
            const roles = await handler.Role.getRoles(req.query.all)
            if (!roles.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(roles)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Role By Id
RoleRouter.get(
    "/roles/:id",
    middleware.permission(helper.permissions.role_read),
    async (req: Request<any>, res: Response) => {
        try {
            const role = await handler.Role.getRoleById(req.params.id)
            if (role == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(role)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Role and Permission
RoleRouter.post(
    "/roles",
    middleware.permission(helper.permissions.role_create),
    async (req: Request, res: Response) => {
        try {
            const role = await handler.Role.createRole(req.body)
            res.status(httpStatus.Created).json(role)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update Role and Permission
RoleRouter.put(
    "/roles/:id",
    middleware.permission(helper.permissions.role_update),
    async (req: Request, res: Response) => {
        try {
            const role = await handler.Role.UpdateRoleById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json(role)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)
export { RoleRouter }
