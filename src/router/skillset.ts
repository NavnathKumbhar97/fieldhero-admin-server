import { Router, Request, Response, NextFunction } from "express"
import { SkillSet } from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const SkillSetRouter = Router()

// SkillSet

//* Fetch All Skills Sets
SkillSetRouter.get(
    "/skills",
    middleware.permission(helper.permissions.skill_read_all),
    (req: Request, res: Response, next: NextFunction) => {
        SkillSet.getSkillSets(req.query.all)
            .then((skills) => {
                if (!skills.length) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(skills)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

//* Fetch Skills Set By Id
SkillSetRouter.get(
    "/skills/:id",
    middleware.permission(helper.permissions.skill_read),
    (req: Request<any>, res: Response, next: NextFunction) => {
        SkillSet.getSkillSetById(req.params.id)
            .then((skill) => {
                if (skill == null) {
                    res.sendStatus(httpStatus.No_Content)
                }
                res.status(httpStatus.OK).json(skill)
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

// * Create Skills Sets
SkillSetRouter.post(
    "/skills",
    middleware.permission(helper.permissions.skill_create),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const skill = await SkillSet.createSkillSet({ ...req.body })
            if (skill == null) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Skillset already exist",
                })
            } else {
                res.status(httpStatus.Created).json(skill)
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error,
            })
        }
    }
)

// * Update skills Set Recored
SkillSetRouter.put(
    "/skills/:id",
    middleware.permission(helper.permissions.skill_update),
    (req: Request, res: Response, next: NextFunction) => {
        SkillSet.updateSkillSetById({ id: req.params.id, ...req.body })
            .then((skill) => res.status(httpStatus.OK).json(skill))
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
interface DeleteSkillSetByIdParam {
    id: number
}
// * Delete skillSet
SkillSetRouter.delete(
    "/skills/:id",
    (
        req: Request<DeleteSkillSetByIdParam>,
        res: Response,
        next: NextFunction
    ) => {
        SkillSet.deleteSkillSetById(req.params.id)
            .then((skill) =>
                res.status(httpStatus.OK).json({
                    Message: "Row Delete Successfully",
                    Success: skill,
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
export { SkillSetRouter }
