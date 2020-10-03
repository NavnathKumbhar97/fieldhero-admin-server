import { Router, Request, Response, NextFunction } from "express"
import { httpStatus } from "../helper"
import { Company } from "../handlers"
import { companyValidation } from "../validation/company"
const CompanyRouter = Router()

// Company
//* Fetch All Company List
CompanyRouter.get(
    "/companies",
    (req:Request, res:Response, next:NextFunction) => {
    Company
        .getCompanies(req.query.all)
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
//* Fetch Company By Id
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

//* Create Company
CompanyRouter.post(
    "/companies",
    companyValidation,
    (req:Request, res:Response, next:NextFunction) => {
    Company.createCompany({ ...req.body })
        .then((company) => {
            if(company == null ){
                res.status(httpStatus.Conflict).json({"Success":"Company Already Exits"})
            }
            res.status(httpStatus.Created).json(company)
        })
        .catch((err) => {
            console.log(err)
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request, 
                error: err 
            })
        })
})

// Update Compnay 
CompanyRouter.put(
    "/companies/:id",
    companyValidation,
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
