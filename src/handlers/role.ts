// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper

/**
 * Get All Roles
 * @param all
 */

const getRoles = async (all: string): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const roles = await prisma.role.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
                isSystemGenerated: true,
            },
            where: {
                isActive: whereCondition,
                id: {
                    notIn: whereCondition ? [1, 3] : [3],
                },
            },
            orderBy: { name: "asc" },
        })

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", roles)
    } catch (error) {
        log.error(error.message, "Error while getRoles")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getRoles"
        )
    }
}

/**
 * Get Role By Id
 * @param id
 */

const getRoleById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const _role = await prisma.role.findFirst({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                isActive: true,
                isSystemGenerated: true,
                RolePermission: {
                    select: { permissionId: true },
                },
            },
        })
        if (!_role)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Role not found"
            )

        const { RolePermission, ...rest } = _role
        const result = {
            ...rest,
            permissions: RolePermission.map((x) => x.permissionId),
        }

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while getRoleById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getRoleById"
        )
    }
}

/**
 * create Role
 */
interface createRoleParam {
    name: string
    description: string
    isActive?: boolean
    permissionId: Array<number>
}

const createRole = async (
    userLoginId: number,
    param: createRoleParam
): Promise<helper.IResponseObject> => {
    try {
        const role = await prisma.role.create({
            data: {
                name: param.name,
                description: param.description,
                isActive: "isActive" in param ? param.isActive : undefined,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
                RolePermission: {
                    createMany: {
                        data: param.permissionId.map((perm) => ({
                            permissionId: perm,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        })),
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Role created successfully",
            role
        )
    } catch (error) {
        log.error(error.message, "Error while createRole")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createRole"
        )
    }
}
/**
 * Update Role Id
 */
interface updateRoleParam {
    id: number
    name: string
    description: string
    permissionId: Array<number>
}

const updateRoleById = async (
    userLoginId: number,
    param: updateRoleParam
): Promise<helper.IResponseObject> => {
    try {
        const role = await prisma.role.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!role)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "Role not found"
            )
        // Delete all permissions
        await prisma.rolePermission.deleteMany({
            where: {
                roleId: role.id,
            },
        })

        // update role details
        const updatedRole = await prisma.role.update({
            where: {
                id: role.id,
            },
            data: {
                name: param.name,
                description: param.description,
                createdBy: userLoginId,
                RolePermission: {
                    createMany: {
                        data: param.permissionId.map((perm) => ({
                            permissionId: perm,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        })),
                    },
                },
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Role updated successfully",
            updatedRole
        )
    } catch (error) {
        log.error(error.message, "Error while updateRoleById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateRoleById"
        )
    }
}

const Role = {
    getRoles,
    getRoleById,
    createRole,
    updateRoleById,
}
export { Role }
