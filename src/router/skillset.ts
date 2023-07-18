import { Router, Request, Response } from "express"
import * as handler from "../handlers"
import * as middleware from "./middleware"
import * as helper from "../helper"
import { body, validationResult } from "express-validator"
const { httpStatus } = helper

const SkillRouter = Router()

// SkillSet

//* Fetch All Skills Sets
SkillRouter.get(
    "/skills",
    middleware.permission(helper.permissions.skill_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.SkillSet.getSkills(
                req.query.all as string ,Number(req.query.take),
                Number(req.query.skip)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
//* Fetch All Skills Sets for filter
SkillRouter.get(
    "/all-skills",
    middleware.permission(helper.permissions.skill_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.SkillSet.getSkillsForFilter(
                req.query.all as string ,Number(req.query.take),
                Number(req.query.skip)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Skills Set By Id
SkillRouter.get(
    "/skills/:id",
    middleware.permission(helper.permissions.skill_read),

    async (req: Request, res: Response) => {
        try {
            const result = await handler.SkillSet.getSkillById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * Create Skills Sets
SkillRouter.post(
    "/skills",
    middleware.permission(helper.permissions.skill_create),
    body("title").notEmpty().withMessage("Skill Name is required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.SkillSet.createSkill(
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

// * Update skills Set Recored
SkillRouter.put(
    "/skills/:id",

    middleware.permission(helper.permissions.skill_update) ,
    // body("title").notEmpty().withMessage("Skill Name is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.SkillSet.updateSkillById(
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

export { SkillRouter }
