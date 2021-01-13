import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import "../auth/passport"
import { httpStatus } from "../helper"

const LoginRouter = Router()
LoginRouter.use(passport.initialize())

//* Admin Login API
LoginRouter.post(
    "/login",
    (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
            "/users/login",
            { session: false },
            (err, user, info) => {
                if (err) {
                    res.status(httpStatus.Bad_Request).send({ message: err })
                } else if (!user) {
                    res.status(httpStatus.Bad_Request).send({
                        message: info.message,
                    })
                } else if (user) {
                    req.login(user.id, (err) => {
                        const dataStoredInToken = { id: user.id }
                        const secret = process.env.JWT_SECRET_KEY!
                        const token = jwt.sign(dataStoredInToken, secret, {})
                        res.status(httpStatus.OK).send({
                            auth: true,
                            token,
                            user,
                            message: "User logged in successfully",
                        })
                    })
                }
            }
        )(req, res, next)
    }
)

export { LoginRouter }
