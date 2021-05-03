// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper

/**
 * Get All Permission
 * @param all
 */

const getPermissions = async (all: string): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const permissions = await prisma.permission.findMany({
            where: {
                isActive: whereCondition,
            },
            orderBy: [{ group: "asc" }, { id: "asc" }],
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            permissions
        )
    } catch (error) {
        log.error(error.message, "Error while getPermissions")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getPermissions"
        )
    }
}

/**
 * Get Permission By Id
 * @param id
 */

const getPermissionsById = async (
    id: number
): Promise<helper.IResponseObject> => {
    try {
        const permission = await prisma.permission.findFirst({
            where: { id },
        })
        if (!permission)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Permission not found"
            )

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            permission
        )
    } catch (error) {
        log.error(error.message, "Error while getPermissionsById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getPermissionsById"
        )
    }
}

const Permission = {
    getPermissions,
    getPermissionsById,
}
export { Permission }
