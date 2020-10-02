import { Router, Request, Response, NextFunction } from "express"
import { SkillSet } from "../handlers"
import { httpStatus } from "../helper"

const SkillSetRouter = Router()

// SkillSet

//* Fetch All Skills Sets
SkillSetRouter.get("/skills", (req:Request, res:Response, next:NextFunction) => {
    SkillSet
        .getSkillSets()
        .then((skills) => {
            if (!skills.length) {
                res.status(httpStatus.OK).json({
                    Success: "Not Recored Found",
                })
            }
            res.status(httpStatus.OK).json(skills)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({ 
                code: httpStatus.Bad_Request,
             error: err 
        })
    )
})

interface GetSkillSetByIdParam {
    id: number
}
//* Fetch Skills Set By Id 
SkillSetRouter.get(
    "/skills/:id", 
    (req:Request<GetSkillSetByIdParam>, res:Response, next:NextFunction) => {
    SkillSet
        .getSkillSetById(req.params.id)
        .then((skill) => {
            res.status(httpStatus.OK).json(skill)
        })
        .catch((err) => res.status(httpStatus.Bad_Request).json({ 
            code: httpStatus.Bad_Request, 
            error: err 
        })
    )
})

// Create Skills Sets
SkillSetRouter.post(
    "/skills",
    (req:Request, res:Response, next:NextFunction) => {
    SkillSet
        .createSkillSet({ ...req.body })
        .then((skill) => {
            if(skill == null ){
                res.status(httpStatus.Conflict).json({"Success":"SkillSet Already Exits"})
            }
            res.status(httpStatus.Created).json(skill)
        })
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err 
            })
        )
    }
)

// Update skills Set Recored 
SkillSetRouter.put(
    "/skills/:id",
    (req:Request, res:Response, next:NextFunction) => {
    SkillSet
        .updateSkillSetById({ id: req.params.id, ...req.body })
        .then((skill) => 
            res.status(httpStatus.OK).json(skill)
        )
        .catch((err) => 
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: err
            })
        )
    }
)

export { SkillSetRouter }