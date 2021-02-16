import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const IndustryRouter = Router()
// Industry

//* Fetch all Industry
IndustryRouter.get(
    "/industries",
    middleware.permission(helper.permissions.industry_read_all),
    async (req: Request, res: Response) => {
        try {
            const industries = await handler.Industry.getIndustries(
                req.query.all
            )
            if (!industries.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(industries)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Industry By Id
IndustryRouter.get(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_read),
    async (req: Request<any>, res: Response) => {
        try {
            const industry = await handler.Industry.getIndustryById(
                req.params.id
            )
            if (industry == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(industry)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Industry
IndustryRouter.post(
    "/industries",
    middleware.permission(helper.permissions.industry_create),
    async (req: Request, res: Response) => {
        try {
            const industry = await handler.Industry.createIndustry({
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
            handler.express.handleRouterError(res, error)
        }
    }
)
//* Update Industry
IndustryRouter.put(
    "/industries/:id",
    middleware.permission(helper.permissions.industry_update),
    async (req: Request, res: Response) => {
        try {
            const industry = await handler.Industry.updateIndustryById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json({
                Message: "Data Updated Successfully",
                Success: industry,
            })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Industry
IndustryRouter.delete(
    "/industries/:id",
    async (req: Request<any>, res: Response) => {
        try {
            const industry = await handler.Industry.deleteIndustryById(
                req.params.id
            )
            res.status(httpStatus.OK).json({
                message: "Row Delete Successfully",
                success: industry,
            })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)
export { IndustryRouter }
