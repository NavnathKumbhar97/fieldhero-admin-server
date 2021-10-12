import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
const CompanyRouter = Router()

// Company
//* Fetch All Company List
CompanyRouter.get(
    "/companies",
    middleware.permission(helper.permissions.company_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Company.getCompanies(
                req.query.all as string
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Company By Id
CompanyRouter.get(
    "/companies/:id",
    middleware.permission(helper.permissions.company_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Company.getCompanyById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
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
            const result = await handler.Company.createCompany(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
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
            const result = await handler.Company.updatedCompanyById(
                helper.getUserLoginId(req.user),
                {
                    id: parseInt(req.params.id),
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { CompanyRouter }
