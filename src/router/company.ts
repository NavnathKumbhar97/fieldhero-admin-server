import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
const { httpStatus } = helper
const CompanyRouter = Router()

// Company
//* Fetch All Company List
CompanyRouter.get(
    "/companies",
    middleware.permission(helper.permissions.company_read_all),
    async (req: Request, res: Response) => {
        try {
            const companies = await handler.Company.getCompanies(req.query.all)
            if (!companies.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(companies)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Company By Id
CompanyRouter.get(
    "/companies/:id",
    middleware.permission(helper.permissions.company_read),
    async (req: Request<any>, res: Response) => {
        try {
            const company = await handler.Company.getCompanyById(req.params.id)
            if (company == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(company)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Company
CompanyRouter.post(
    "/companies",
    middleware.permission(helper.permissions.company_create),
    async (req: Request, res: Response) => {
        try {
            const company = await handler.Company.createCompany({ ...req.body })
            if (!company) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Company already exist",
                })
            } else {
                res.status(httpStatus.Created).json(company)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update Compnay
CompanyRouter.put(
    "/companies/:id",
    middleware.permission(helper.permissions.company_update),
    async (req: Request, res: Response) => {
        try {
            const company = await handler.Company.updatedCompanyById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json(company)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Delete Company
CompanyRouter.delete(
    "/companies/:id",
    async (req: Request<any>, res: Response) => {
        try {
            const company = await handler.Company.deleteCompanyById(
                req.params.id
            )
            res.status(httpStatus.OK).json({
                success: company,
                message: "Row Delete Successfully",
            })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CompanyRouter }
