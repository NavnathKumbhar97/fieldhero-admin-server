import { Router, Request, Response, NextFunction } from "express"
import { Role } from "../handlers"
import { httpStatus } from "../helper"

const RoleRouter = Router()

// Roles

//* Fetch all Roles

RoleRouter.get(
    "/roles",
    (req: Request, res: Response, next: NextFunction) => {
        Role.getRoles(req.query.all)
            .then((roles) => {
                if (!roles.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(roles)
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
interface GetRoleByIdParam {
    id: number
}

RoleRouter.get(
    "/role/:id",
    (req: Request<GetRoleByIdParam>, res: Response, next: NextFunction) => {
        Role.getRoleById(req.params.id)
            .then((role) => {
                if (role == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(role)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Create Role and Permission

RoleRouter.post(
    "/role",
    (req: Request, res: Response, next: NextFunction) => {
        Role.createRole(req.body)
        .then((role) =>{
            res.status(httpStatus.Created).json(role)
        }).catch((err)=>{
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err,
            })
        })
    }
)

//* Update Role and Permission

RoleRouter.put(
    "/role/:id",
    (req: Request, res: Response, next: NextFunction) => {
        Role.UpdateRoleById({
            id:req.params.id,
            ...req.body
        })
        .then((role) =>{
            res.status(httpStatus.OK).json(role)
        }).catch((err)=>{
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err,
            })
        })
    }
)
export { RoleRouter }
