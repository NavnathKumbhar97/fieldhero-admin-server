import { Router, Request, Response } from "express"
import express from "express"
import path from "path"
import passport from "passport"
// local imports
import { httpStatus } from "../helper"
import { LoginRouter } from "./passport"
import { IndustryRouter } from "./industry"
import { SkillRouter } from "./skillset"
import { CompanyRouter } from "./company"
import { CandidateRouter } from "./candidate"
import { SubscriptionRouter } from "./subscriptions"
import { CustomerRouter } from "./customer"
import { RoleRouter } from "./role"
import { PermissionRouter } from "./permission"
import { UploadRouter } from "./upload"
import { UserRouter } from "./user"
import { AgentRouter } from "./agent"
import { CandidateUploadBatchRouter } from "./candidateUploadBatch"

const router = Router()
router.use("/public", express.static(path.join(process.cwd(), "public")))

//call routers
router.use(LoginRouter)
// initiate jwt token authorization
router.use(passport.authenticate("jwt", { session: false }))
// router below will use passport jwt authorization
router.use(IndustryRouter)
router.use(SkillRouter)
router.use(CompanyRouter)
router.use(CandidateRouter)
router.use(UploadRouter)
router.use(SubscriptionRouter)
router.use(CustomerRouter)
router.use(PermissionRouter)
router.use(RoleRouter)
router.use(UserRouter)
router.use(AgentRouter)
router.use(CandidateUploadBatchRouter)

// Bad Request
router.all("*", (req: Request, res: Response) => {
    res.status(httpStatus.Bad_Request).json({
        code: httpStatus.Bad_Request,
        message: "Bad Request - Url not found",
    })
})

export { router as routerV1 }
