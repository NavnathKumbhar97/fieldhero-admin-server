import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import "../auth/passport"
import { httpStatus } from "../helper"

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
                        res.status(httpStatus.Bad_Request).json({
                            code: httpStatus.Bad_Request,
                            error: error,
                        })
                    }
                }
            }
        )(req, res, next)
    }
)

export { LoginRouter }
