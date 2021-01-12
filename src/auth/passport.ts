import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { customerDB } from "../sequelize"
// import crypto from "crypto"
import { passwordfunction } from "../helper"

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
                    attributes: ["id", "email", "passwordHash"],
                })
                if (!user) {
                    done(null, false, { message: "Email not found" })
                } else {
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
                }
            } catch (error) {
                done(error)
            }
        }
    )
)
/**
 * JWT for all authenticated route
 */
passport.use(
    "jwt",
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        },
        async (jwtPayload, done) => {
            const user = await customerDB.UserLogin.findOne({
                where: { id: jwtPayload.id },
            }).catch((err) => done(err))
            if (!user) {
                done(null, false, { message: "Authorization failed" })
            } else {
                done(null, user)
            }
        }
    )
)
