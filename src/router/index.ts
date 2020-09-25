import { Router, Request, Response } from "express"
import { httpStatus } from "../helper"
import { IndustryRouter } from "./industry"
const router = Router()

router.use(IndustryRouter)

router.all("*", (req: Request, res: Response) => {
    res.status(httpStatus.Bad_Request).json({
        error: {
            code: httpStatus.Bad_Request,
            message: "Bad Request - Url not found",
        },
    })
})

export { router as routerV1 }
