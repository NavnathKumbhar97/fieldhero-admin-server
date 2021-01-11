import { Request } from "express"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { ormCustomer, customerDB } from "../sequelize"
import crypto from "crypto"

/**
 * Login Api
 */

passport.use(
    "login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            session: false,
        },
        async (email, password, done) => {
            try {
                const user = await customerDB.UserLogin.findOne({
                    where: { email: email },
                    attributes: ["id", "email", "passwordHash", "isVerified"],
                })
                if (!user) {
                    done(null, false, { message: "Email not found" })
                } else {
                    if (user.isVerified == processStatus.verified) {
                        const isVerified = await passwordfunction.verifyPassword(
                            password,
                            user.passwordHash
                        )
                        if (isVerified) {
                            const userJson: any = user.toJSON()
                            delete userJson.passwordHash
                            done(null, userJson)
                        } else {
                            done(null, false, {
                                message: "Password does not match",
                            })
                        }
                    } else {
                        done(null, false, {
                            message: "User is not verified",
                        })
                    }
                }
            } catch (error) {
                done(error)
            }
        }
    )
)
