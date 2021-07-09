import { Router, Request, Response } from "express"
// local imports
import * as handler from "../handlers"
import * as helper from "../helper"
import middleware from "./middleware"

const AgentPricingTemplateRouter = Router()

// * fetch all agent pricing templates
AgentPricingTemplateRouter.get(
    "/agent-pricing-templates",
    middleware.permission(helper.permissions.agent_pricing_template_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.AgentPricingTemplate.fetchAll(
                req.query.all as string
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * fetch agent pricing template by id
AgentPricingTemplateRouter.get(
    "/agent-pricing-templates/:id",
    middleware.permission(helper.permissions.agent_pricing_template_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.AgentPricingTemplate.fetchById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * create agent pricing template
AgentPricingTemplateRouter.post(
    "/agent-pricing-templates",
    middleware.permission(helper.permissions.agent_pricing_template_create),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.AgentPricingTemplate.create(
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

// * set agent pricing tempalte active by id
AgentPricingTemplateRouter.post(
    "/agent-pricing-templates/:id/active",
    middleware.permission(helper.permissions.agent_pricing_template_set_active),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.AgentPricingTemplate.setActiveById(
                helper.getUserLoginId(req.user),
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error) {
            handler.express.handleRouterError(res, error)
        }
    }
)

export { AgentPricingTemplateRouter }
