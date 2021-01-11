import { Router, Request, Response, NextFunction } from "express"
import passport from "passport"
import jwt from "jsonwebtoken"
import moment from "moment"

const LoginRouter = Router()
LoginRouter.use(passport.initialize())

//* Admin Login API



export { LoginRouter }
