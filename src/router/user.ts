import { Router, Request, Response, NextFunction } from "express"
import { User } from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const UserRouter = Router()

// User Create

//* Create User Details

UserRouter.post(
    "/users",
    middleware.permission(helper.permissions.user_create),
    (req: Request, res: Response, next: NextFunction) => {
        User.createUser(req.body)
            .then((user) => {
                res.status(httpStatus.Created).json(user)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

//* Update User Details

UserRouter.put(
    "/users/:id",
    middleware.permission(helper.permissions.user_update),
    (req: Request, res: Response, next: NextFunction) => {
        User.updateUserById({
            id: req.params.id,
            ...req.body,
        })
            .then((user) => {
                res.status(httpStatus.Created).json(user)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * Get user Details
UserRouter.get(
    "/users",
    middleware.permission(helper.permissions.user_create),
    (req: Request, res: Response, next: NextFunction) => {
        User.getUser(req.query.all)
            .then((users) => {
                if (!users.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(users)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Fetch User By Id
UserRouter.get(
    "/users/:id",
    middleware.permission(helper.permissions.user_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        User.getUserById(req.params.id)
            .then((user) => {
                if (user == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(user)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

export { UserRouter }
