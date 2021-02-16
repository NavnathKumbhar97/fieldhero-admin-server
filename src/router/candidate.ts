import { Router, Request, Response, NextFunction } from "express"
import bodyParser from "body-parser"
import * as middleware from "./middleware"
import { Candidate } from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper

const CandidateRouter = Router()

//* Fetch all Candidate
CandidateRouter.get(
    "/candidates",
    middleware.permission(helper.permissions.candidate_basic_read_all),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Candidate.getCandidates(req.query)
            .then((candidates) => {
                if (!candidates.Candidates.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(candidates)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Fetch Candidate by Id
CandidateRouter.get(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Candidate.getCandidateById(req.params.id)
            .then((candidate) => {
                if (candidate == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(candidate)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* create candidate
CandidateRouter.post(
    "/candidates",
    middleware.permission(helper.permissions.candidate_create),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.createCandidate({ ...req.body })
            .then((candidate) => {
                res.status(httpStatus.Created).json(candidate)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Update candiate
CandidateRouter.put(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_update),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.updateCandidateById({
            id: req.params.id,
            ...req.body,
        })
            .then((candidate) => {
                res.status(httpStatus.OK).json(candidate)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

// * Delete CandiateById
CandidateRouter.delete(
    "/candidates/:id",
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.deleteCandiateById(parseInt(req.params.id))
            .then((candidate) => {
                res.status(httpStatus.OK).json(candidate)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

// * Delete truncate All Candidate
CandidateRouter.delete(
    "/candidates",
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.deleteAllCandiate()
            .then((candidate) => {
                res.status(httpStatus.OK).json(candidate)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* bulk create candidates
CandidateRouter.post(
    "/bulkcandidates",
    bodyParser.json({ limit: 1024 * 1024 * 5 }),
    middleware.permission(helper.permissions.candidate_basic_bulk_create),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await Candidate.createBulkCandidate(req.body)
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
            // res.status(httpStatus.OK).json(candidate)
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error.message,
            })
        }
    }
)
// * Fetch all Candidate Trainig-Cerf
CandidateRouter.get(
    "/candidates/:id/training-cert",
    middleware.permission(helper.permissions.candidate_certification_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.getCandidateTrainingCert(parseInt(req.params.id))
            .then((cert) => {
                res.status(httpStatus.Created).json(cert)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
// * get Candidate Tranining-cref By Id
CandidateRouter.get(
    "/candidates/:id/training-cert/:certId",
    middleware.permission(helper.permissions.candidate_certification_read),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.getCandidateTrainingCertById(
            parseInt(req.params.id),
            parseInt(req.params.certId)
        )
            .then((cert) => {
                if (cert == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(cert)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
// * Create Candidate Trainig-Cerf
CandidateRouter.post(
    "/candidates/:id/training-cert",
    middleware.permission(helper.permissions.candidate_certification_create),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.addCandidateTrainingCert({
            ...req.body,
            candidate: req.params.id,
        })
            .then((cert) => {
                res.status(httpStatus.Created).json(cert)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
// * Update Candidate Trainig-Cerf
CandidateRouter.put(
    "/candidates/:id/training-cert/:certId",
    middleware.permission(helper.permissions.candidate_certification_update),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.updateCandidateTrainingCertById({
            id: req.params.certId,
            candidate: req.params.id,
            ...req.body,
        })
            .then((cert) => res.status(httpStatus.OK).json(cert))
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Delete Candiate Traninig Cert
CandidateRouter.delete(
    "/candidates/:id/training-cert/:certId",
    (req: Request<any>, res: Response, next: NextFunction) => {
        Candidate.removeCandidateTrainingCert({ id: req.params.certId })
            .then((deletedRows) =>
                res.status(httpStatus.OK).json({
                    Message: "Row Delete Successfully",
                    Success: deletedRows,
                })
            )
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* get Candidate work history
CandidateRouter.get(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.getCandidatesWorkHistory(parseInt(req.params.id))
            .then((candidatesWorkHistory) => {
                if (!candidatesWorkHistory.length) {
                    res.sendStatus(httpStatus.No_Content)
                } else res.status(httpStatus.OK).json(candidatesWorkHistory)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
//* get Candiate  work History By Id
CandidateRouter.get(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_read),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.getCandidateWorkHistoryById(
            parseInt(req.params.id),
            parseInt(req.params.workId)
        )
            .then((candidatesWorkHistory) => {
                if (candidatesWorkHistory == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(candidatesWorkHistory)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Create Candiate Work History
CandidateRouter.post(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_create),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.addCandidateWorkHistory({
            ...req.body,
            candidate: req.params.id,
        })
            .then((workHistory) =>
                res.status(httpStatus.Created).json(workHistory)
            )
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Update Candiate WorkHistory
CandidateRouter.put(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_update),
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.updateCandidateWorkHistoryById({
            id: req.params.workId,
            candidate: req.params.id,
            ...req.body,
        })
            .then((updatedWorkHistory) =>
                res.status(httpStatus.OK).json(updatedWorkHistory)
            )
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Delete Candidate Work History
CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    (req: Request<any>, res: Response, next: NextFunction) => {
        Candidate.removeCandidateWorkHistory({ id: req.params.workId })
            .then((deletedRows) =>
                res.status(httpStatus.OK).json({
                    Message: "Delete Data Successfully",
                    Success: deletedRows,
                })
            )
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

export { CandidateRouter }
