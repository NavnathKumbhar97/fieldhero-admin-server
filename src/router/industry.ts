import { Router, Request, Response, NextFunction } from "express"
import { Industry } from "../handlers"
import { httpStatus } from "../helper"

const IndustryRouter = Router()
// Industry

//* Fetch all Industry
IndustryRouter.get(
    "/industries",
    (req: Request, res: Response, next: NextFunction) => {
        Industry.getIndustries()
            .then((industries) => {
                if (!industries.length) {
                    res.status(httpStatus.OK).json({
                        Success: "Not Recored Found",
                    })
                }
                res.status(httpStatus.OK).json(industries)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

interface GetIndustryByIdParam {
    id: number
}
//* Fetch Industry By Id
IndustryRouter.get(
    "/industries/:id",
    (req: Request<GetIndustryByIdParam>, res: Response, next: NextFunction) => {
        Industry.getIndustryById(req.params.id)
            .then((industry) => {
                if (!industry) {
                    res.status(httpStatus.OK).json({
                        Success: "Not Recored Found",
                    })
                }
                res.status(httpStatus.OK).json(industry)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Create Industry 
IndustryRouter.post(
    "/industries",
    (req: Request, res: Response, next: NextFunction) => {
        Industry.createIndustry({ ...req.body })
            .then((industry) => {
                if(industry == null) {
                    res.status(httpStatus.Conflict).json({"Success":"Industry Already Exits"})
                }
                res.status(httpStatus.Created).json(industry)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
//* Update Industry
IndustryRouter.put(
    "/industries/:id",
    (req:Request, res:Response, next:NextFunction) => {
    Industry.
        updateIndustryById({
            id: req.params.id,
            ...req.body 
        })
        .then((industry) =>
            res.status(httpStatus.OK).json({
                "Message":"Data Updated Successfully",
                "Success":industry})
        )
        .catch((err) =>
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err
            })
        )
    }
)

export { IndustryRouter }
