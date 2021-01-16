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
                const userLogin = await customerDB.UserLogin.findOne({
                    where: { email: email },
                    include: [
                        {
                            model: customerDB.User,
                            attributes: ["id", "uuid"],
                        },
                        {
                            model: customerDB.Role,
                            attributes: ["id", "uuid"],
                        },
                    ],
                    attributes: [
                        "id",
                        "userId",
                        "roleId",
                        "email",
                        "passwordHash",
                    ],
                })
                if (!userLogin) {
                    done(null, false, { message: "Email not found" })
                } else {
                    const isVerified = await passwordfunction.verifyPassword(
                        password,
                        userLogin.passwordHash
                    )
                    if (isVerified) {
                        const userJson: any = userLogin.toJSON()
                        const {
                            email,
                            user_master,
                            roleId,
                            role_master,
                            ...rest
                        } = userJson
                        done(null, {
                            email,
                            id: user_master.id,
                            uuid: user_master.uuid,
                            roleId: role_master.uuid,
                        })
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
            const user = await customerDB.User.findOne({
                where: { uuid: jwtPayload.sub },
            }).catch((err) => done(err))
            if (!user) {
                done(null, false, { message: "Authorization failed" })
            } else {
                done(null, user)
            }
        }
    )
)
