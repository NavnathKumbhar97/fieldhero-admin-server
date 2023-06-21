import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import middleware from "./middleware"
import { body, validationResult } from "express-validator"

const CategoryRouter = Router()

//* fetch all categories
CategoryRouter.get(
    "/categories",
    middleware.permission(helper.permissions.category_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Category.fetchAll(
                req.query.all as string,
                Number(req.query.take),
                Number(req.query.skip)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
CategoryRouter.get(
    "/all-categories",
    middleware.permission(helper.permissions.category_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Category.fetchAllForFilter(
                req.query.all as string,
                Number(req.query.take),
                Number(req.query.skip)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* fetch category by id
CategoryRouter.get(
    "/categories/:id",
    middleware.permission(helper.permissions.category_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Category.fetchById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Category
CategoryRouter.post(
    "/categories",
    middleware.permission(helper.permissions.category_create),
    body("title").notEmpty().withMessage("title is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result = await handler.Category.create(
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

//* Update category by id
CategoryRouter.put(
    "/categories/:id",
    middleware.permission(helper.permissions.category_update),
    body("title").notEmpty().withMessage("title is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Category.updateById(
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

export { CategoryRouter }
