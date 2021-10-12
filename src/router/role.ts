import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import * as middleware from "./middleware"
const RoleRouter = Router()

//* Fetch all Roles
RoleRouter.get(
    "/roles",
    middleware.permission(helper.permissions.role_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.getRoles(req.query.all as string)
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Role By Id
RoleRouter.get(
    "/roles/:id",
    middleware.permission(helper.permissions.role_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.getRoleById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Role
RoleRouter.post(
    "/roles",
    middleware.permission(helper.permissions.role_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.createRole(
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

//* Update Role
RoleRouter.put(
    "/roles/:id",
    middleware.permission(helper.permissions.role_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.updateRoleById(
                helper.getUserLoginId(req.user),
                {
                    id: parseInt(req.params.id),
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
export { RoleRouter }
