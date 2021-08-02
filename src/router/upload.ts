import { Router, Request, Response, Express } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const UploadRouter = Router()

// configure storage for multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `public/uploads/candidates/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${
            req.params.id
        }-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
})

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg"
    ) {
        return cb(null, true)
    } else {
        return cb(new Error("Only image files are allowed!"), false)
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

//Upload route

UploadRouter.post(
    "/upload-profile/:id",
    middleware.permission(
        helper.permissions.candidate_basic_upload_profile_image
    ),
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            const file = req.file
            if (!file)
                return res.status(httpStatus.Not_Found).json({
                    code: httpStatus.Not_Found,
                    message: "File not found",
                    data: null,
                })

            const path = file.destination + "/" + file.filename
            const result = await handler.UploadImage.updateCandidateProfileById(
                parseInt(req.params.id),
                path
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { UploadRouter }
