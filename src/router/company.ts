import { Router, Request, Response, NextFunction } from "express"
import { httpStatus } from "../helper"
import { Company } from "../handlers"

const CompanyRouter = Router()

// Company
CompanyRouter.get(
    "/companies",
    (req:Request, res:Response, next:NextFunction) => {
    Company
        .getCompanies()
        .then((companies) => {
            if(!companies.length){
                res.status(httpStatus.OK).json({
                    Success: "Not Recored Found",
                }) 
            }
            res.status(httpStatus.OK).json(companies)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
})

interface GetCompanyByIdParam {
    id: number
}

CompanyRouter.get(
    "/companies/:id",
    (req:Request<GetCompanyByIdParam>, res:Response, next:NextFunction) => {
    Company
        .getCompanyById(req.params.id)
        .then((company) => {
            res.status(httpStatus.OK).json(company)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request, 
                error: err 
            })
        )
})


CompanyRouter.post(
    "/companies",
    (req:Request, res:Response, next:NextFunction) => {
    Company.createCompany({ ...req.body })
        .then((company) => {
            res.status(httpStatus.OK).json(company)
        })
        .catch((err) => {
            console.log(err)
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request, 
                error: err 
            })
        })
})

CompanyRouter.put(
    "/companies/:id",
    (req:Request, res:Response, next:NextFunction) => {
    Company.updatedCompanyById({ id: req.params.id, ...req.body })
        .then((company) => 
            res.status(httpStatus.OK).json(company)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

export { CompanyRouter }
