import { Router, Request, Response } from "express"
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"

const CandidateVerificationRouter = Router()

// * Create candidate verifications
CandidateVerificationRouter.post(
    "/candidate-verification",
    middleware.permission(helper.permissions.candidate_verification_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateVerification.createCandidateVerification(
                helper.getUserLoginId(req.user)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Fetch all candidate verifications
CandidateVerificationRouter.get(
    "/candidate-verification",
    middleware.permission(helper.permissions.candidate_verification_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateVerification.getCandidateVerifications(
                helper.getUserLoginId(req.user)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Get dashboard for user
CandidateVerificationRouter.get(
    "/candidate-verification/dashboard",
    middleware.permission(helper.permissions.candidate_verification_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateVerification.getDashboardForUser(
                helper.getUserLoginId(req.user)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Fetch candidate verification by id
CandidateVerificationRouter.get(
    "/candidate-verification/:id",
    middleware.permission(helper.permissions.candidate_verification_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateVerification.getCandidateVerificationById(
                helper.getUserLoginId(req.user),
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update candidate verification by id
CandidateVerificationRouter.put(
    "/candidate-verification/:id",
    middleware.permission(helper.permissions.candidate_verification_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.CandidateVerification.updateCandidateVerificationById(
                helper.getUserLoginId(req.user),
                parseInt(req.params.id),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateVerificationRouter }
