import { Request, Response } from "express"
// local imports
import helper, { httpStatus } from "../helper"
import prisma from "../prisma"

const getDashboard = async (req: Request, res: Response) => {
    try {
        const totalActiveCandidates = await prisma.candidate.count({
            where: {
                isActive: true,
                status: "APPROVED",
            },
        })

        const stats = {
            totalActiveCandidates,
        }

        const { code, data, message } = helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            stats
        )

        res.status(code).json({ code, data, message })
    } catch (error: any) {
        helper.log.error(
            error.message,
            "Error while getDashboard for logged in user"
        )
        const { code, data, message } = helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getDashboard for logged in user"
        )
        res.status(code).json({ code, data, message })
    }
}

export { getDashboard }
export default { getDashboard }
