import { Router, Request, Response, NextFunction } from "express"
import * as middleware from "./middleware"
import { Company } from "../handlers"
import { companyValidation } from "../validation/company"
import * as helper from "../helper"
const { httpStatus, log } = helper
const CompanyRouter = Router()

// Company
//* Fetch All Company List
CompanyRouter.get(
    "/companies",
    middleware.permission(helper.permissions.company_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        Company.getCompanies(req.query.all)
            .then((companies) => {
                if (!companies.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(companies)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
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
    companyValidation,
    (req: Request, res: Response, next: NextFunction) => {
        Company.createCompany({ ...req.body })
            .then((company) => {
                if (company == null) {
                    res.status(httpStatus.Conflict).json({
                        Success: "Company Already Exits",
                    })
                }
                res.status(httpStatus.Created).json(company)
            })
            .catch((err) => {
                log.error(err)
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

// * Update Compnay
CompanyRouter.put(
    "/companies/:id",
    middleware.permission(helper.permissions.company_update),
    companyValidation,
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
