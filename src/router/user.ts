import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const UserRouter = Router()

//* Create User Details
UserRouter.post(
    "/users",
    middleware.permission(helper.permissions.user_create),
    async (req: Request, res: Response) => {
        try {
            const user = await handler.User.createUser(req.body)
            res.status(httpStatus.Created).json(user)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update User Details
UserRouter.put(
    "/users/:id",
    middleware.permission(helper.permissions.user_update),
    async (req: Request, res: Response) => {
        try {
            const user = await handler.User.updateUserById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.Created).json(user)
        } catch (error) {
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
            const users = await handler.User.getUser(req.query.all)
            if (!users.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(users)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch User By Id
UserRouter.get(
    "/users/:id",
    middleware.permission(helper.permissions.user_read),
    async (req: Request<any>, res: Response) => {
        try {
            const user = await handler.User.getUserById(req.params.id)
            if (user == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(user)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* User self - change password
UserRouter.post(
    "/users/change-password",
    middleware.permission(helper.permissions.user_self_change_password),
    async (req: Request<any>, res: Response) => {
        try {
            const _user: any = req.user
            const result = await handler.User.changePassword(
                _user.id,
                req.body.old_password,
                req.body.new_password
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { UserRouter }
