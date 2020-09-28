import { Router, Request, Response, NextFunction } from "express"
import { Candidate  } from "../handlers"
import { httpStatus } from "../helper"

const CandidateRouter = Router()

// Candidate
CandidateRouter.get(
    "/candidates",
    (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .getCandidates()
        .then((candidates) => {
            if(!candidates.length) {
                res.status(httpStatus.OK).json({
                    Success: "Not Recored Found",
                }) 
            }
            res.status(httpStatus.OK).json(candidates)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)
interface GetCandidateByIdParam {
    id: number
}

CandidateRouter.get(
    "/candidates/:id",
    (req:Request<GetCandidateByIdParam>, res:Response, next:NextFunction) => {
        Candidate
        .getCandidateById(req.params.id)
        .then((candidate) => {
            res.status(httpStatus.OK).json(candidate)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
})


CandidateRouter.post(
    "/candidates",
    (req:Request, res:Response, next:NextFunction) => {
    // console.log(req.body)
    Candidate
        .createCandidate({ ...req.body })
        .then((candidate) => { 
            res.status(httpStatus.OK).json(candidate)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
})

CandidateRouter.post(
    "/candidates/:id/training-cert",
    (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .addCandidateTrainingCert({
            ...req.body,
            candidate: req.params.id,
        })
        .then((cert) => {
            res.status(httpStatus.OK).json(cert)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
})

CandidateRouter.put(
    "/candidates/:id/training-cert/:certId",
    (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .updateCandidateTrainingCertById({ id: req.params.certId, ...req.body })
        .then((cert) => 
            res.status(httpStatus.OK).json(cert)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err
            })
        )
})

interface RemoveCandidateByIdParam {
    certId: number
}

CandidateRouter.delete(
    "/candidates/:id/training-cert/:certId",
    (req:Request<RemoveCandidateByIdParam>, res:Response, next:NextFunction) => {
    Candidate
        .removeCandidateTrainingCert({ id: req.params.certId })
        .then((deletedRows) => 
            res.status(httpStatus.OK).json({
                "Message":"Row Delete Successfully",
                "Success":deletedRows
            })
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

CandidateRouter.post(
    "/candidates/:id/work-history",
    (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .addCandidateWorkHistory({
            ...req.body,
            candidate: req.params.id,
        })
        .then((workHistory) =>
            res.status(httpStatus.OK).json(workHistory)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

CandidateRouter.put(
    "/candidates/:id/work-history/:workId",
    (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .updateCandidateWorkHistoryById({ 
            id: req.params.workId,
            ...req.body 
        })
        .then((updatedWorkHistory) => 
            res.status(httpStatus.OK).json(updatedWorkHistory)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

interface RemoveCandidateWorkHistoryByIdParam {
    workId: number
}

CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    (req:Request<RemoveCandidateWorkHistoryByIdParam>, res:Response, next:NextFunction) => {
    Candidate
        .removeCandidateWorkHistory({ id: req.params.workId })
        .then((deletedRows) => 
            res.status(httpStatus.OK).json({
                "Message":"Delete Data Successfully",
                "Success":deletedRows
            })
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err
            })
        )
})
export { CandidateRouter }
