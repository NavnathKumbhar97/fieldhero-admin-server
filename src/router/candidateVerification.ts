import { Router, Request, Response } from "express"
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
import { body, check, validationResult } from "express-validator"

const CandidateVerificationRouter = Router()

// * Create candidate verifications
CandidateVerificationRouter.post(
    "/candidate-verifications",
    middleware.permission(helper.permissions.candidate_verification_create),
    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateVerification.createCandidateVerification(
                    helper.getUserLoginId(req.user)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Fetch all candidate verifications
CandidateVerificationRouter.get(
    "/candidate-verifications",
    middleware.permission(helper.permissions.candidate_verification_read_all),

    async (req: Request, res: Response) => {
        try {

            const result =
                await handler.CandidateVerification.getCandidateVerifications(
                    helper.getUserLoginId(req.user),
                    Number(req.query.take),
                    Number(req.query.skip)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Get dashboard for user
CandidateVerificationRouter.get(
    "/candidate-verifications/dashboard",
    middleware.permission(helper.permissions.candidate_verification_read_all),

    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateVerification.getDashboardForUser(
                    helper.getUserLoginId(req.user)
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//get passive update
CandidateVerificationRouter.get(
    "/candidate-verifications/passive-update",
    middleware.permission(helper.permissions.candidate_verification_update),

    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateVerification.fetchPassiveUpdate()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Fetch candidate verification by id
CandidateVerificationRouter.get(
    "/candidate-verifications/:id",
    middleware.permission(helper.permissions.candidate_verification_read),

    async (req: Request, res: Response) => {
        try {
            const result =
                await handler.CandidateVerification.getCandidateVerificationById(
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

// * Update candidate verification by id
CandidateVerificationRouter.put(
    "/candidate-verifications/:id",
    middleware.permission(helper.permissions.candidate_verification_update),
    body("candidateConsent").notEmpty().withMessage("Candidate Consent is required"),
    body("callStatus").notEmpty().withMessage("Call Status is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result =
                await handler.CandidateVerification.updateCandidateVerificationById(
                    helper.getUserLoginId(req.user),
                    parseInt(req.params.id),
                    req.body
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateVerificationRouter }
