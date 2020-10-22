import { Router, Request, Response, NextFunction } from "express"
import { Candidate } from "../handlers"
import { httpStatus } from "../helper"
import { createCandidateValidation } from "../validation/candidate"

const CandidateRouter = Router()

// Candidate

//* Fetch all Candidate
CandidateRouter.get(
    "/candidates",
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.getCandidates(req.query.all)
            .then((candidates) => {
                if (!candidates.length) {
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
interface GetCandidateByIdParam {
    id: number
}

//* Fetch Candidate by Id
CandidateRouter.get(
    "/candidates/:id",
    (
        req: Request<GetCandidateByIdParam>,
        res: Response,
        next: NextFunction
    ) => {
        Candidate.getCandidateById(req.params.id)
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

//* create candidate
CandidateRouter.post(
    "/candidates",
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
    createCandidateValidation,
    (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body)
        Candidate.createBulkCandidate(req.body)
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
// * get Candidate Trainig-Cerf
CandidateRouter.get(
    "/candidates/:id/training-cert",
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
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.
        getCandidateTrainingCertById(parseInt(req.params.id),parseInt(req.params.certId))
        .then((cert) => {
            if(cert == null) {
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

interface RemoveCandidateByIdParam {
    certId: number
}
//* Delete Candiate Traninig Cert
CandidateRouter.delete(
    "/candidates/:id/training-cert/:certId",
    (
        req: Request<RemoveCandidateByIdParam>,
        res: Response,
        next: NextFunction
    ) => {
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
    (req: Request, res: Response, next: NextFunction) => {
        Candidate.
        getCandidateWorkHistoryById(parseInt(req.params.id),parseInt(req.params.workId))
        .then((candidatesWorkHistory) => {
            if(candidatesWorkHistory == null){
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

interface RemoveCandidateWorkHistoryByIdParam {
    workId: number
}

//* Delete Candidate Work History
CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    (
        req: Request<RemoveCandidateWorkHistoryByIdParam>,
        res: Response,
        next: NextFunction
    ) => {
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
