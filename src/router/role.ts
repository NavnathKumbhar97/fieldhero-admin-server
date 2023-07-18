import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import * as middleware from "./middleware"
import { body, validationResult } from "express-validator"
const RoleRouter = Router()

//* Fetch all Roles
RoleRouter.get(
    "/roles",
    middleware.permission(helper.permissions.role_read_all),

    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.getRoles(req.query.all as string
                ,Number(req.query.take),
                Number(req.query.skip)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
//* Fetch all Roles for filter
RoleRouter.get(
    "/all-roles",
    middleware.permission(helper.permissions.role_read_all),

    async (req: Request, res: Response) => {
        try {
            const result = await handler.Role.getRolesForFilter(req.query.all as string
                ,Number(req.query.take),
                Number(req.query.skip)
                )
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
    body("name").notEmpty().withMessage("Role Name is required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
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
    // body("name").notEmpty().withMessage("Role Name is required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
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
