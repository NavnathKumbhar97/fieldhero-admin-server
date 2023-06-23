import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
import controller from "../controller"
import { body, validationResult } from "express-validator"

const UserRouter = Router()

//* Create User Details
UserRouter.post(
    "/users",
    middleware.permission(helper.permissions.user_create),
    body("currAddress").notEmpty().withMessage("Current address required"),
    body("currCity").notEmpty().withMessage("Current city required"),
    body("currState").notEmpty().withMessage("Current state required"),
    body("email").notEmpty().withMessage("Email required"),
    body("fullName").notEmpty().withMessage("Full Name required"),
    body("contactNo").notEmpty().withMessage("Contact number required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.User.createUser(
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

//* Update User Details
UserRouter.put(
    "/users/:id",
    middleware.permission(helper.permissions.user_update),
    body("currAddress").notEmpty().withMessage("Current address required"),
    body("currCity").notEmpty().withMessage("Current city required"),
    body("currState").notEmpty().withMessage("Current state required"),
    body("email").notEmpty().withMessage("Email required"),
    body("fullName").notEmpty().withMessage("Full Name required"),
    body("contactNo").notEmpty().withMessage("Contact number required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.User.updateUserById(
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

// * Get user Details
UserRouter.get(
    "/users",
    middleware.permission(helper.permissions.user_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.User.getUsers(req.query.all as string ,Number(req.query.take),
            Number(req.query.skip))
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
// * Get users for filter
UserRouter.get(
    "/all-users",
    middleware.permission(helper.permissions.user_read_all) ,
    async (req: Request, res: Response) => {
        try {
            const result = await handler.User.getUsersForFilter(req.query.all as string ,Number(req.query.take),
            Number(req.query.skip))
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Get logged in user dashboard
UserRouter.get(
    "/users/dashboard",
    middleware.permission(helper.permissions.none) ,
    controller.User.getDashboard
)

//* Fetch User By Id
UserRouter.get(
    "/users/:id",
    middleware.permission(helper.permissions.user_read) ,
    async (req: Request, res: Response) => {
        try {
            const result = await handler.User.getUserById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* User self - change password
UserRouter.post(
    "/users/change-password",
    middleware.permission(helper.permissions.user_self_change_password) ,
    body("confirm_password").notEmpty().withMessage("confirm password required"),
    body("new_password").notEmpty().withMessage("new password required"),
    body("old_password").notEmpty().withMessage("old password required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.User.changePassword(
                helper.getUserLoginId(req.user),
                req.body.old_password,
                req.body.new_password
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { UserRouter }
