import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"

const CandidateUploadBatchRouter = Router()

//* Fetch all Candidate batches for agent
CandidateUploadBatchRouter.get(
    "/candidate-upload-batches",
    middleware.permission(
        helper.permissions.candidate_upload_batch_read_all
    ),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateUploadBatch.getAllCandidateUploadBatches()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateUploadBatchRouter }
