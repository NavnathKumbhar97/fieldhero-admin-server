import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
// local imports
import * as helper from "../helper"
import config from "../config"

import prisma from "../prisma"
const { log, passwordfunction } = helper

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
                const userLogin = await prisma.userLogin.findFirst({
                    where: { email, roleId: { not: 3 } },
                    include: {
                        User: {
                            select: {
                                id: true,
                                fullName: true,
                                uuid: true,
                            },
                        },
                        Role: {
                            select: {
                                id: true,
                                uuid: true,
                                RolePermission: {
                                    select: {
                                        permissionId: true,
                                    },
                                },
                            },
                        },
                    },
                })

                if (!userLogin)
                    return done(null, false, { message: "Email not found" })
                const isVerified = await passwordfunction.verifyPassword(
                    password,
                    userLogin.passwordHash
                )
                if (!isVerified)
                    return done(null, false, {
                        message: "Password does not match",
                    })

                const { email: emailId, User, Role } = userLogin
                const { RolePermission } = Role
                done(null, {
                    email: emailId,
                    name: User.fullName,
                    id: User.id,
                    uuid: User.uuid,
                    roleId: Role.uuid,
                    permissions: RolePermission.map((x) => x.permissionId),
                })
            } catch (error) {
                log.error(error.message, "error while login")
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
            secretOrKey: config.JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        uuid: jwtPayload.sub,
                    },
                    select: {
                        id: true,
                        uuid: true,
                        UserLogin: {
                            select: {
                                id: true,
                                Role: true,
                            },
                        },
                    },
                })

                if (!user)
                    return done(null, false, {
                        message: "Authorization failed",
                    })

                done(null, {
                    id: user.id,
                    uuid: user.uuid,
                    loginId: user.UserLogin?.id,
                    role: {
                        ...user.UserLogin?.Role,
                    },
                })
            } catch (error) {
                log.error(error.message, "error while jwt")
                done(error)
            }
        }
    )
)
