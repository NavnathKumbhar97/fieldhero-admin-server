import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as helper from "../helper"
import * as handler from "../handlers"
import { body, validationResult } from "express-validator"

const AgentRouter = Router()
// Agent

//* Fetch all agents
AgentRouter.get(
    "/agents",
    middleware.permission(helper.permissions.agent_read_all),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await handler.Agent.getAllAgents(Number(req.query.take),
            Number(req.query.skip))
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch agent by id
AgentRouter.get(
    "/agents/:id",
    middleware.permission(helper.permissions.agent_read),

    async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await handler.Agent.getAgentById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create agent
AgentRouter.post(
    "/agents",
    middleware.permission(helper.permissions.agent_create),
    body("agentNo").notEmpty().withMessage("Agent Number is required"),
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("contactNo").notEmpty().withMessage("Contact no is required"),

    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Agent.createAgent(
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

//* Update agent
AgentRouter.put(
    "/agents/:id",
    middleware.permission(helper.permissions.agent_update),
    body("agentNo").notEmpty().withMessage("Agent Number is required"),
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("contactNo").notEmpty().withMessage("Contact no is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Agent.updateAgent(
                helper.getUserLoginId(req.user),
                parseInt(req.params.id),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { AgentRouter }
