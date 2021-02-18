import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
// local imports
import "../auth/passport"
import { httpStatus } from "../helper"
import * as handler from "../handlers"

const LoginRouter = Router()
LoginRouter.use(passport.initialize())

interface IUserParam {
    email: string
    id: number
    uuid: string
    roleId: string
    permissions: Array<number>
}

//* Admin Login API
LoginRouter.post(
    "/users/login",
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "login",
            { session: false },
            (err, user: IUserParam, info) => {
                if (err) {
                    res.status(httpStatus.Bad_Request).send({ message: err })
                } else if (!user) {
                    res.status(httpStatus.Bad_Request).send({
                        message: info.message,
                    })
                } else if (user) {
                    try {
                        const dataStoredInToken = {
                            sub: user.uuid,
                            role: user.roleId,
                        }
                        const secret = process.env.JWT_SECRET_KEY!
                        const token = jwt.sign(dataStoredInToken, secret, {
                            expiresIn: "8h",
                        })
                        res.status(httpStatus.OK).send({
                            auth: true,
                            token,
                            user: {
                                email: user.email,
                                id: user.id,
                                permissions: user.permissions,
                            },
                            message: "User logged in successfully",
                        })
                    } catch (error) {
                        handler.express.handleRouterError(res, error)
                    }
                }
            }
        )(req, res, next)
    }
)

LoginRouter.post(
    "/users/forgot-password",
    async (req: Request, res: Response) => {
        try {
            if (!req.body.email) {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: "Email is required",
                })
            } else {
                const response = await handler.User.createResetPasswordToken(
                    req.body.email
                )
                if (response) {
                    const { code, message, status, data } = response
                    if (status) {
                        res.status(code).json({
                            message,
                            data,
                        })
                    } else {
                        res.status(code).json({
                            message,
                        })
                    }
                } else {
                    res.status(httpStatus.Bad_Request).json({
                        code: httpStatus.Bad_Request,
                    })
                }
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

LoginRouter.get(
    "/users/verify-reset-password",
    async (req: Request, res: Response) => {
        try {
            if (!req.query.token) {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: "No token received",
                })
            } else if (!req.query.email) {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: "Email is required",
                })
            } else {
                const response = await handler.User.resetPasswordForUser(
                    req.query.token as string,
                    req.query.email as string
                )
                if (response) {
                    const { code, message, status, data } = response
                    if (status) {
                        res.status(code).json({
                            message,
                            data,
                        })
                    } else {
                        res.status(code).json({
                            message,
                        })
                    }
                } else {
                    res.status(httpStatus.Bad_Request).json({
                        code: httpStatus.Bad_Request,
                    })
                }
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { LoginRouter }
