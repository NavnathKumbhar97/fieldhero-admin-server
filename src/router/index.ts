import { Router, Request, Response } from "express"
import { httpStatus } from "../helper"
import { IndustryRouter } from "./industry"
import { SkillSetRouter } from "./skillset"
import { CompanyRouter } from "./company"
import { CandidateRouter} from "./candidate"
import {UploadRouter} from "./upload"

const router = Router()

router.use(IndustryRouter)
router.use(SkillSetRouter)
router.use(CompanyRouter)
router.use(CandidateRouter)
router.use(UploadRouter)

router.all("*", (req: Request, res: Response) => {
    res.status(httpStatus.Bad_Request).json({
        error: {
            code: httpStatus.Bad_Request,
            message: "Bad Request - Url not found",
        },
    })
})

export { router as routerV1 }
