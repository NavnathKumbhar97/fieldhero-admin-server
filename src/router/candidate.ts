import { Router, Request, Response, json as bodyParserJson } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"

const CandidateRouter = Router()

//* Fetch all Candidate
CandidateRouter.get(
    "/candidates",
    middleware.permission(helper.permissions.candidate_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidates(
                req.query as { all: string; page: string; limit: string }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Candidate by Id
CandidateRouter.get(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidateById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* create candidate
CandidateRouter.post(
    "/candidates",
    middleware.permission(helper.permissions.candidate_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.createCandidate(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update candiate
CandidateRouter.put(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.updateCandidateById(
                helper.getUserLoginId(req.user),
                {
                    id: req.params.id,
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* bulk create candidates
CandidateRouter.post(
    "/bulkcandidates",
    // 50mb
    bodyParserJson({ limit: 1024 * 1024 * 50 }),
    middleware.permission(helper.permissions.candidate_basic_bulk_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.createCandidateRaw(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Fetch all Candidate Trainig-Cerf
CandidateRouter.get(
    "/candidates/:id/training-cert",
    middleware.permission(helper.permissions.candidate_certification_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidateTrainingCerts(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * get Candidate Tranining-cref By Id
CandidateRouter.get(
    "/candidates/:id/training-cert/:certId",
    middleware.permission(helper.permissions.candidate_certification_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidateTrainingCertById(
                parseInt(req.params.id),
                parseInt(req.params.certId)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Create Candidate Trainig-Cerf
CandidateRouter.post(
    "/candidates/:id/training-cert",
    middleware.permission(helper.permissions.candidate_certification_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.addCandidateTrainingCert(
                helper.getUserLoginId(req.user),
                {
                    ...req.body,
                    candidate: req.params.id,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)
// * Update Candidate Trainig-Cerf
CandidateRouter.put(
    "/candidates/:id/training-cert/:certId",
    middleware.permission(helper.permissions.candidate_certification_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.updateCandidateTrainingCertById(
                helper.getUserLoginId(req.user),
                {
                    id: req.params.certId,
                    candidate: req.params.id,
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candiate Traninig Cert
CandidateRouter.delete(
    "/candidates/:id/training-cert/:certId",
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.removeCandidateTrainingCert({
                id: parseInt(req.params.certId),
            })
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candidate work history
CandidateRouter.get(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidatesWorkHistory(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candiate  work History By Id
CandidateRouter.get(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidateWorkHistoryById(
                parseInt(req.params.id),
                parseInt(req.params.workId)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Candiate Work History
CandidateRouter.post(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.addCandidateWorkHistory(
                helper.getUserLoginId(req.user),
                {
                    ...req.body,
                    candidate: req.params.id,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update Candiate WorkHistory
CandidateRouter.put(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_update),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.updateCandidateWorkHistoryById(
                helper.getUserLoginId(req.user),
                {
                    id: req.params.workId,
                    candidate: req.params.id,
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candidate Work History
CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.removeCandidateWorkHistory({
                id: parseInt(req.params.workId),
            })
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateRouter }
