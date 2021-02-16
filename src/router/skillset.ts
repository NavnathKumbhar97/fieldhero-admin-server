import { Router, Request, Response, NextFunction } from "express"
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
const { httpStatus } = helper

const SkillSetRouter = Router()

// SkillSet

//* Fetch All Skills Sets
SkillSetRouter.get(
    "/skills",
    middleware.permission(helper.permissions.skill_read_all),
    async (req: Request, res: Response) => {
        try {
            const skills = await handler.SkillSet.getSkillSets(req.query.all)
            if (!skills.length) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(skills)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Skills Set By Id
SkillSetRouter.get(
    "/skills/:id",
    middleware.permission(helper.permissions.skill_read),
    async (req: Request<any>, res: Response) => {
        try {
            const skill = await handler.SkillSet.getSkillSetById(req.params.id)
            if (skill == null) {
                res.sendStatus(httpStatus.No_Content)
            } else {
                res.status(httpStatus.OK).json(skill)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Create Skills Sets
SkillSetRouter.post(
    "/skills",
    middleware.permission(helper.permissions.skill_create),
    async (req: Request, res: Response) => {
        try {
            const skill = await handler.SkillSet.createSkillSet({ ...req.body })
            if (skill == null) {
                res.status(httpStatus.Conflict).json({
                    code: httpStatus.Conflict,
                    message: "Skillset already exist",
                })
            } else {
                res.status(httpStatus.Created).json(skill)
            }
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Update skills Set Recored
SkillSetRouter.put(
    "/skills/:id",
    middleware.permission(helper.permissions.skill_update),
    async (req: Request, res: Response) => {
        try {
            const skill = await handler.SkillSet.updateSkillSetById({
                id: req.params.id,
                ...req.body,
            })
            res.status(httpStatus.OK).json(skill)
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)
interface DeleteSkillSetByIdParam {
    id: number
}
// * Delete skillSet
SkillSetRouter.delete(
    "/skills/:id",
    async (req: Request<DeleteSkillSetByIdParam>, res: Response) => {
        try {
            const skill = await handler.SkillSet.deleteSkillSetById(
                req.params.id
            )
            res.status(httpStatus.OK).json({
                Message: "Row Delete Successfully",
                Success: skill,
            })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)
export { SkillSetRouter }
