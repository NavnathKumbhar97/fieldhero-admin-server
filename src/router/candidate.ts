import { Router, Request, Response } from "express"
import bodyParser from "body-parser"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const CandidateRouter = Router()

//* Fetch all Candidate
CandidateRouter.get(
    "/candidates",
    middleware.permission(helper.permissions.candidate_read_all),
    async (req: Request<any>, res: Response) => {
        try {
            const candidates = await handler.Candidate.getCandidates(req.query)
            if (!candidates.Candidates.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(candidates)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Candidate by Id
CandidateRouter.get(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_read),
    async (req: Request<any>, res: Response) => {
        try {
            const candidate = await handler.Candidate.getCandidateById(
                req.params.id
            )
            if (candidate == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(candidate)
            }
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
            const candidate = await handler.Candidate.createCandidate({
                ...req.body,
            })
            res.status(httpStatus.Created).json(candidate)
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
            const candidate = await handler.Candidate.updateCandidateById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json(candidate)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Delete CandiateById
CandidateRouter.delete(
    "/candidates/:id",
    async (req: Request, res: Response) => {
        try {
            const candidate = await handler.Candidate.deleteCandiateById(
                parseInt(req.params.id)
            )
            res.status(httpStatus.OK).json(candidate)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Delete truncate All Candidate
CandidateRouter.delete("/candidates", async (req: Request, res: Response) => {
    try {
        const candidate = await handler.Candidate.deleteAllCandiate()
        res.status(httpStatus.OK).json(candidate)
    } catch (error) {
        handler.express.handleRouterError(res, error)
    }
})

//* bulk create candidates
CandidateRouter.post(
    "/bulkcandidates",
    // 50mb
    bodyParser.json({ limit: 1024 * 1024 * 50 }),
    middleware.permission(helper.permissions.candidate_basic_bulk_create),
    async (req: Request, res: Response) => {
        try {
            const response = await handler.Candidate.createBulkCandidate(
                req.body,
                helper.getUserLoginId(req.user)
            )
            if (response) {
                if (response.status) {
                    res.status(response.code).json({
                        status: response.code,
                        message: response.message,
                        data: response.data,
                    })
                } else {
                    res.status(response.code).json({
                        status: response.code,
                        message: response.message,
                    })
                }
            }
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
            const cert = await handler.Candidate.getCandidateTrainingCert(
                parseInt(req.params.id)
            )
            res.status(httpStatus.Created).json(cert)
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
            const cert = await handler.Candidate.getCandidateTrainingCertById(
                parseInt(req.params.id),
                parseInt(req.params.certId)
            )
            if (cert == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(cert)
            }
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
            const cert = await handler.Candidate.addCandidateTrainingCert({
                ...req.body,
                candidate: req.params.id,
            })
            res.status(httpStatus.Created).json(cert)
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
            const cert = await handler.Candidate.updateCandidateTrainingCertById(
                {
                    id: req.params.certId,
                    candidate: req.params.id,
                    ...req.body,
                }
            )
            res.status(httpStatus.OK).json(cert)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candiate Traninig Cert
CandidateRouter.delete(
    "/candidates/:id/training-cert/:certId",
    async (req: Request<any>, res: Response) => {
        try {
            const deletedRows = await handler.Candidate.removeCandidateTrainingCert(
                { id: req.params.certId }
            )
            res.status(httpStatus.OK).json({
                success: deletedRows,
                message: "Row Delete Successfully",
            })
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
            const candidatesWorkHistory = await handler.Candidate.getCandidatesWorkHistory(
                parseInt(req.params.id)
            )
            if (!candidatesWorkHistory.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(candidatesWorkHistory)
            }
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
            const candidatesWorkHistory = await handler.Candidate.getCandidateWorkHistoryById(
                parseInt(req.params.id),
                parseInt(req.params.workId)
            )
            if (candidatesWorkHistory == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(candidatesWorkHistory)
            }
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
            const workHistory = await handler.Candidate.addCandidateWorkHistory(
                {
                    ...req.body,
                    candidate: req.params.id,
                }
            )
            res.status(httpStatus.Created).json(workHistory)
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
            const updatedWorkHistory = await handler.Candidate.updateCandidateWorkHistoryById(
                {
                    id: req.params.workId,
                    candidate: req.params.id,
                    ...req.body,
                }
            )
            res.status(httpStatus.OK).json(updatedWorkHistory)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candidate Work History
CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    async (req: Request<any>, res: Response) => {
        try {
            const deletedRows = await handler.Candidate.removeCandidateWorkHistory(
                { id: req.params.workId }
            )
            res.status(httpStatus.OK).json({
                success: deletedRows,
                message: "Delete Data Successfully",
            })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CandidateRouter }
