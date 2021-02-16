import { Router, Request, Response, NextFunction } from "express"
import { Industry } from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const IndustryRouter = Router()
// Industry

//* Fetch all Industry
IndustryRouter.get(
    "/industries",
    middleware.permission(helper.permissions.industry_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Industry.getIndustries(req.query.all)
            .then((industries) => {
                if (!industries.length) {
                    res.sendStatus(httpStatus.No_Content)
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

//* Fetch Industry By Id
IndustryRouter.get(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_read),
    async (req: Request<any>, res: Response, next: NextFunction) => {
        try {
            const industry = await Industry.getIndustryById(req.params.id)
            if (industry == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(industry)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error,
            })
        }
    }
)

//* Create Industry
IndustryRouter.post(
    "/industries",
    middleware.permission(helper.permissions.industry_create),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const industry = await Industry.createIndustry({
                ...req.body,
            })
            if (industry == null) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Industry already exist",
                })
            } else {
                res.status(httpStatus.Created).json(industry)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error,
            })
        }
    }
)
//* Update Industry
IndustryRouter.put(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_update),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const industry = await Industry.updateIndustryById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json({
                Message: "Data Updated Successfully",
                Success: industry,
            })
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                message: error.message,
            })
        }
    }
)

//* Delete Industry
IndustryRouter.delete(
    "/industries/:id",
    (req: Request<any>, res: Response, next: NextFunction) => {
        Industry.deleteIndustryById(req.params.id)
            .then((industry) =>
                res.status(httpStatus.OK).json({
                    Message: "Row Delete Successfully",
                    Success: industry,
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
export { IndustryRouter }
