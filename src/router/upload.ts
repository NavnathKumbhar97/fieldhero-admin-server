import { Router, Request, Response, Express, response } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const UploadRouter = Router()

// configure storage for multer
// upload Profile image for candidate master module 
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `/Users/navnath/Desktop/Apexa/Projects/fieldhero-admin-server/public/uploads/candidates/profile_image`
        // `.../public/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
    // destination: function (req, file, cb) {
    //     cb(null, '../assets');
    //  },
    //  filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname);
    //  }
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

UploadRouter.post(
    "/upload-profile",
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
            const results = await handler.UploadImage.UploadImgCandidate(
            path)
            // const { code, data, message } = results
            res.send(results)
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
            console.log("got an error ",error);
            res.send(error)
        }
    }
)

// upload multiple documents for agent master module 
const storageFile = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `/Users/navnath/Desktop/Apexa/Projects/fieldhero-admin-server/public/uploads/Agent-Master/${req.params.id}/docs`
        // `.../public/${req.params.id}/profile_image`
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
    // destination: function (req, file, cb) {
    //     cb(null, '../assets');
    //  },
    //  filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname);
    //  }
})
const fileFilterFile = (req: Request, file: Express.Multer.File, cb: any) => {
    // if (
    //     file.mimetype == "file"
    // ) {
        return cb(null, true)
    // } else {
    //     return cb(new Error("Only image files are allowed!"), false)
    // }
}

const uploadFile = multer({ storage: storageFile, fileFilter: fileFilterFile })

UploadRouter.post(
    "/upload-agent-master/:id",
    middleware.permission(
        helper.permissions.candidate_basic_upload_profile_image
    ),
    uploadFile.single("file"),
    async (req: Request, res: Response) => {
        try {
            const files = req.file
            if (!files){
                return res.status(httpStatus.Not_Found).json({
                    code: httpStatus.Not_Found,
                    message: "File not found",
                    data: null,
                })
            }

            const path = files.destination + "/" + files.filename
            const results = await handler.UploadImage.UploadImgCandidate(
            path)
            // const { code, data, message } = results
            res.send(results)
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
            console.log("got an error ",error);
            res.send(error)
        }
    }
)

// upload documents for admin candidate batch 
const storageAdminCnd = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `/Users/navnath/Desktop/Apexa/Projects/fieldhero-admin-server/public/uploads/Admin-candidate-upload-batch/Bulk-Data`
        // `.../public/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${
            "bulk-data"
        }-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
    // destination: function (req, file, cb) {
    //     cb(null, '../assets');
    //  },
    //  filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname);
    //  }
})
const fileFilterAdminCnd = (req: Request, file: Express.Multer.File, cb: any) => {
    //  if (
    //     file.mimetype == "xlsx"
    // ) {
        return cb(null, true)
    // } else {
    //     return cb(new Error("Only xlsx files are allowed!"), false)
    // }
}


const uploadAdminCnd = multer({ storage: storageAdminCnd, fileFilter: fileFilterAdminCnd })

UploadRouter.post(
    "/upload-admin-candidate-uploadBatch",
    middleware.permission(
        helper.permissions.candidate_basic_upload_profile_image
    ),
    uploadAdminCnd.single("file"),
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
            const results = await handler.UploadImage.UploadImgCandidate(
            path)
            // const { code, data, message } = results
            res.send(results)
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
            console.log("got an error ",error);
            res.send(error)
        }
    }
)

// upload documents for candidate upload batch 
const storageCndBacth = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `/Users/navnath/Desktop/Apexa/Projects/fieldhero-admin-server/public/uploads/Candidate-upload-batch/Bulk-Data`
        // `.../public/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${
            "bulk-data"
        }-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
    // destination: function (req, file, cb) {
    //     cb(null, '../assets');
    //  },
    //  filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname);
    //  }
})
const fileFilterCndBatch = (req: Request, file: Express.Multer.File, cb: any) => {
    //  if (
    //     file.mimetype == "xlsx"
    // ) {
        return cb(null, true)
    // } else {
    //     return cb(new Error("Only xlsx files are allowed!"), false)
    // }
}


const uploadCndBatch = multer({ storage: storageCndBacth, fileFilter: fileFilterCndBatch })

UploadRouter.post(
    "/upload-candidate-uploadBatch",
    middleware.permission(
        helper.permissions.candidate_basic_upload_profile_image
    ),
    uploadCndBatch.single("file"),
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
            const results = await handler.UploadImage.UploadImgCandidate(
            path)
            // const { code, data, message } = results
            res.send(results)
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
            console.log("got an error ",error);
            res.send(error)
        }
    }
)

// upload documents for customer
const storageCustomer = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const p = `/Users/navnath/Desktop/Apexa/Projects/fieldhero-admin-server/public/uploads/Customer-Profile-Images`
        // `.../public/${req.params.id}/profile_image`
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p, { recursive: true })
        }
        cb(null, p)
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
        const datetimestamp = Date.now()
        const newFilename = `${file.fieldname}-${
            "bulk-data"
        }-${datetimestamp}${path.extname(file.originalname)}`
        cb(null, newFilename)
    },
    // destination: function (req, file, cb) {
    //     cb(null, '../assets');
    //  },
    //  filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname);
    //  }
})
const fileFilterCustomer = (req: Request, file: Express.Multer.File, cb: any) => {
    //  if (
    //     file.mimetype == "xlsx"
    // ) {
        return cb(null, true)
    // } else {
    //     return cb(new Error("Only xlsx files are allowed!"), false)
    // }
}


const customer = multer({ storage: storageCustomer, fileFilter: fileFilterCustomer })

UploadRouter.post(
    "/upload-customer-profile",
    middleware.permission(
        helper.permissions.candidate_basic_upload_profile_image
    ),
    customer.single("image"),
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
            const results = await handler.UploadImage.UploadImgCandidate(
            path)
            // const { code, data, message } = results
            res.send(results)
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
            console.log("got an error ",error);
            res.send(error)
        }
    }
)
export { UploadRouter }
