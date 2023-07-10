import { Router, Request, Response, json as bodyParserJson } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
import { body, check, validationResult } from "express-validator"

const CandidateUploadBatchRouter = Router()

//* Fetch all Candidate batches for current user
CandidateUploadBatchRouter.get(
    "/candidate-upload-batches",
    middleware.permission(
        helper.permissions.candidate_upload_batch_self_read_all
    ),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateUploadBatch.fetchAll(
                req.query,
                helper.getUserLoginId(req.user)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch all candidate batches (admin)
CandidateUploadBatchRouter.get(
    "/admin/candidate-upload-batches",
    middleware.permission(helper.permissions.admin_candidate_upload_batch_approval),
    async (req: Request, res: Response) => {
        try {
            console.log(req.query);
            
            const result = await handler.CandidateUploadBatch.fetchAllAdmin(
                req.query
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * create candidate upload batch for the current user
CandidateUploadBatchRouter.post(
    "/candidate-upload-batches",
    // 50mb
    bodyParserJson({ limit: 1024 * 1024 * 50 }),
    middleware.permission(helper.permissions.candidate_upload_batch_create),
    // body("file").notEmpty().withMessage("file is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Candidate.createCandidateRaw(
                helper.getUserLoginId(req.user),
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * create candidate upload batch for any user by admin
CandidateUploadBatchRouter.post(
    "/admin/candidate-upload-batches",
    // 50mb
    bodyParserJson({ limit: 1024 * 1024 * 50 }),
    middleware.permission(helper.permissions.candidate_upload_batch_create),
    body("file").notEmpty().withMessage("file is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Candidate.createCandidateRaw(
                helper.getUserLoginId(req.user),
                req.body.user,
                req.body,
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Download rejection summary for candidate uploaded batch for curent user
CandidateUploadBatchRouter.get(
    "/candidate-upload-batches/:batchId/download-rejection-summary",
    middleware.permission(
        helper.permissions.candidate_upload_batch_self_read_all
    ),
    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateUploadBatch.getRejectionSummary(
                    parseInt(req.params.batchId),
                    helper.getUserLoginId(req.user)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Download rejection summary for candidate uploaded batch for any user by admin
CandidateUploadBatchRouter.get(
    "/admin/candidate-upload-batches/:batchId/download-rejection-summary",
    middleware.permission(helper.permissions.candidate_upload_batch_read_all),
    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateUploadBatch.getRejectionSummary(
                    parseInt(req.params.batchId)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * change pricing template for candidate uploaded batch
CandidateUploadBatchRouter.put(
    "/admin/candidate-upload-batches/:batchId/change-pricing-template",
    middleware.permission(
        helper.permissions.admin_candidate_upload_batch_change_pricing_template
    ),
    // body("templateId").notEmpty().withMessage("template Name is required"),

    async (req: Request, res: Response) => {
        try {
             // Check for validation errors
             const errors = validationResult(req);
                
             if (!errors.isEmpty()) {
                 return res.status(400).json({ errors: errors.array() });
             }
            const result =
                await handler.CandidateUploadBatch.changeAgentPricingTemplate(
                    helper.getUserLoginId(req.user),
                    parseInt(req.params.batchId),
                    req.body
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

CandidateUploadBatchRouter.get(
    "/admin/candidate-upload-batches/passive-create",
    middleware.permission(
        helper.permissions.admin_candidate_upload_batch_create
    ),
    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateUploadBatch.fetchAdminPassiveCreate()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch batch stats by id for any user by admin
CandidateUploadBatchRouter.get(
    "/admin/candidate-upload-batches/:id/stats",
    middleware.permission(helper.permissions.candidate_upload_batch_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateUploadBatch.fetchStatsById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

CandidateUploadBatchRouter.post(
    "/admin/candidate-upload-batches/:id/approval",
    middleware.permission(
        helper.permissions.admin_candidate_upload_batch_approval
    ),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Admin.Candidate.UploadBatch.approval(
                helper.getUserLoginId(req.user),
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateUploadBatchRouter }
