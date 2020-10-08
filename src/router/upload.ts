import { Router, Request, Response, NextFunction } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { httpStatus } from "../helper"
import { UploadImage } from "../handlers"

const UploadRouter = Router()

// configure storage for multer
const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        let p = `public/uploads/candidates/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })            
        }
        cb(null, p)
    },
    filename: (req: Request, file: any, cb: any) => {
        let datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${
            req.params.id
        }-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
})

const fileFilter = (req: Request, file: any, cb: any) => {
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
    upload.single("image"),
    (req: Request, res: Response, next: NextFunction) => {
        const file = req.file
        if (!file) {
            res.status(httpStatus.Bad_Request).json({
                status: "failed",
                message: "Please upload file",
            })
        } else {
            let path = req.file.destination+'/'+req.file.filename;            
            UploadImage.updateCandidateProfileById(
                parseInt(req.params.id),
                path
            ).then((image) => res.status(httpStatus.OK).json(image))
                .catch((err) =>
                    res.status(httpStatus.Bad_Request).json({
                        code: httpStatus.Bad_Request,
                        error: err,
                    })
                )
        }
    }
)

export { UploadRouter }

