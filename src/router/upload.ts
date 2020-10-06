import { Router, Request, Response, NextFunction } from "express"
import multer from 'multer'
import path from "path"
import fs from "fs"
import { httpStatus } from "../helper"

const UploadRouter = Router()

// configure storage for multer
const storage = multer.diskStorage({
    destination: (req:Request, file:any, cb:any) => {
        let p = `uploads/candidate`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req:Request, file:any, cb:any) => {
        let datetimestamp = Date.now();
        const newFilename = `${file.fieldname}${datetimestamp}${path.extname(
            file.originalname
        )}`
        cb(null, newFilename)
    },
})

const fileFilter = (req:Request, file:any, cb:any) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        return cb(null, true);
    } else {
        return cb(null, false, new Error("Invalide Data Type"));
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });



//Upload route

UploadRouter.post('/upload-profile', upload.single('image'), (req:Request, res:Response, next:NextFunction) => {
    try {
        return res.status(httpStatus.Created).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        res.status(httpStatus.Bad_Request).json({
            code: httpStatus.Bad_Request,
            error: error
        })
    }
});

export { UploadRouter }
