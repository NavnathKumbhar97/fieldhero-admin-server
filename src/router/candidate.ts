import { Router, Request, Response, NextFunction } from "express"
import { Candidate  } from "../handlers"
import { httpStatus } from "../helper"

const CandidateRouter = Router()

// Candidate
CandidateRouter.get("/candidates", (req:Request, res:Response, next:NextFunction) => {
    Candidate
        .getCandidates()
        .then((candidates) => {
            res.status(httpStatus.OK).json(candidates)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
})

export { CandidateRouter }
