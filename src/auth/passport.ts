import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { customerDB } from "../sequelize"
// import crypto from "crypto"
import { log, passwordfunction } from "../helper"

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
                            include: [
                                {
                                    model: customerDB.RolePermission,
                                    attributes: ["permissionId"],
                                },
                            ],
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
                    console.log(userLogin.toJSON())
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
                        const { role_permissions } = role_master
                        done(null, {
                            email,
                            id: user_master.id,
                            uuid: user_master.uuid,
                            roleId: role_master.uuid,
                            permissions: role_permissions.map(
                                (x: any) => x.permissionId
                            ),
                        })
                    } else {
                        done(null, false, {
                            message: "Password does not match",
                        })
                    }
                }
            } catch (error) {
                log.error(error, "error while login")
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
                attributes: ["id", "uuid"],
                include: [
                    {
                        model: customerDB.UserLogin,
                        attributes: ["id", "userId"],
                        include: [
                            {
                                model: customerDB.Role,
                            },
                        ],
                    },
                ],
                where: { uuid: jwtPayload.sub },
            }).catch((err) => done(err))
            if (!user) {
                done(null, false, { message: "Authorization failed" })
            } else {
                const _user: any = user.toJSON()
                done(null, {
                    id: _user.id,
                    uuid: _user.uuid,
                    role: {
                        ..._user.user_login.role_master,
                    },
                })
            }
        }
    )
)
