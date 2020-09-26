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


export { CandidateRouter }
