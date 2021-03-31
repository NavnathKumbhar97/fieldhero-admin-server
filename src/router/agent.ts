import { Router, Request, Response } from "express"
// local imports
import * as middleware from "./middleware"
import * as helper from "../helper"
import * as handler from "../handlers"
const { httpStatus } = helper

const AgentRouter = Router()
// Agent

//* Fetch all agents
AgentRouter.get(
    "/agents",
    middleware.permission(helper.permissions.agent_read_all),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await handler.Agent.getAllAgents()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
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
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create agent
AgentRouter.post(
    "/agents",
    middleware.permission(helper.permissions.agent_create),
    async (req: Request, res: Response) => {
        try {
            const _user: any = req.user
            const result = await handler.Agent.createAgent(_user.id, req.body)
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update agent
AgentRouter.put(
    "/agents/:id",
    middleware.permission(helper.permissions.agent_update),
    async (req: Request, res: Response) => {
        try {
            const _user: any = req.user
            const result = await handler.Agent.updateAgent(
                _user.id,
                parseInt(req.params.id),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { AgentRouter }
