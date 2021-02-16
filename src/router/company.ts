import { Router, Request, Response, NextFunction } from "express"
import * as middleware from "./middleware"
import { Company } from "../handlers"
import * as helper from "../helper"
const { httpStatus, log } = helper
const CompanyRouter = Router()

// Company
//* Fetch All Company List
CompanyRouter.get(
    "/companies",
    middleware.permission(helper.permissions.company_read_all),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companies = await Company.getCompanies(req.query.all)
            if (!companies.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(companies)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error.message,
            })
        }
    }
)

//* Fetch Company By Id
CompanyRouter.get(
    "/companies/:id",
    middleware.permission(helper.permissions.company_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        Company.getCompanyById(req.params.id)
            .then((company) => {
                if (company == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(company)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Create Company
CompanyRouter.post(
    "/companies",
    middleware.permission(helper.permissions.company_create),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const company = await Company.createCompany({ ...req.body })
            if (!company) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Company already exist",
                })
            } else {
                res.status(httpStatus.Created).json(company)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error.message,
            })
        }
    }
)

// * Update Compnay
CompanyRouter.put(
    "/companies/:id",
    middleware.permission(helper.permissions.company_update),
    (req: Request, res: Response, next: NextFunction) => {
        Company.updatedCompanyById({ id: req.params.id, ...req.body })
            .then((company) => res.status(httpStatus.OK).json(company))
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

// * Delete Company
CompanyRouter.delete(
    "/companies/:id",
    (req: Request<any>, res: Response, next: NextFunction) => {
        Company.deleteCompanyById(req.params.id)
            .then((Company) =>
                res.status(httpStatus.OK).json({
                    Message: "Row Delete Successfully",
                    Success: Company,
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

export { CompanyRouter }
