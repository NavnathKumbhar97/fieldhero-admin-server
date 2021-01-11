import { Router, Request, Response } from "express"
import express from "express"
import path from "path"
import { httpStatus } from "../helper"
import { IndustryRouter } from "./industry"
import { SkillSetRouter } from "./skillset"
import { CompanyRouter } from "./company"
import { CandidateRouter } from "./candidate"
import { SubscriptionRouter } from "./subscriptions"
import { CustomerRouter } from "./customer"
import { RoleRouter } from "./role"
import { PermissionRouter } from "./permission"
import { UploadRouter } from "./upload"

const router = Router()
router.use("/public", express.static(path.join(process.cwd(), "public")))

//call routers
router.use(IndustryRouter)
router.use(SkillSetRouter)
router.use(CompanyRouter)
router.use(CandidateRouter)
router.use(UploadRouter)
router.use(SubscriptionRouter)
router.use(CustomerRouter)
router.use(RoleRouter)
router.use(PermissionRouter)


// Bad Request
router.all("*", (req: Request, res: Response) => {
    res.status(httpStatus.Bad_Request).json({
        error: {
            code: httpStatus.Bad_Request,
            message: "Bad Request - Url not found",
        },
    })
})

export { router as routerV1 }
