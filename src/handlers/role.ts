import { customerDB, ormCustomer } from "../sequelize"
import { log } from "../helper"

/**
 * Get All Roles
 * @param all
 */

const getRoles = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const roles = await customerDB.Role.findAll({
        attributes: { exclude: ["uuid"] },
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getRoles")
        throw err
    })
    return roles
}

/**
 * Get Role By Id
 * @param id
 */

const getRoleById = async (id: number) => {
    const role = await customerDB.Role.findOne({
        attributes: {
            exclude: ["uuid"],
        },
        include: [
            {
                model: customerDB.RolePermission,
                attributes: ["permissionId"],
            },
        ],
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getRoleById")
        throw err
    })
    const { role_permissions, ...rest } = role?.toJSON() as any

    return {
        ...rest,
        permissions: role_permissions.map((x: any) => x.permissionId),
    }
}

/**
 * create Role
 */
interface createRoleParam {
    name: string
    description: string
    isActive?: boolean
    permissionId: any
}

const createRole = async (param: createRoleParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const role = await customerDB.Role.create(
            {
                name: param.name,
                description: param.description,
                isActive: param.isActive,
            },
            {
                fields: ["name", "description", "uuid"],
                transaction,
            }
        )
        const permissionArray = param.permissionId
        const permissionArrayObjecct = permissionArray.map((item: number) => {
            return {
                roleId: role.id,
                permissionId: item,
            }
        })
        const rolePrmission = await customerDB.RolePermission.bulkCreate(
            permissionArrayObjecct,
            {
                fields: ["roleId", "permissionId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            role,
            rolePrmission,
        })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while createRole")
        throw err
    }
}
/**
 * Update Role Id
 */
interface updateRoleParam {
    id: number
    name: string
    description: string
    permissionId: any
}

const UpdateRoleById = async (param: updateRoleParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const role = await customerDB.Role.findOne({
            where: { id: param.id },
        })
        //Delete All Permission
        const deleteRolePermission = await customerDB.RolePermission.destroy({
            where: {
                roleId: param.id,
            },
            transaction,
        })
        // update role details
        let updateRole = null
        if (role) {
            role.name = param.name
            role.description = param.description
            updateRole = await role.save()
        }
        {
            transaction
        }
        const permissionArray = param.permissionId
        const permissionArrayObjecct = permissionArray.map((item: number) => {
            return {
                roleId: role?.id,
                permissionId: item,
            }
        })
        // inserted New Role Permission
        const rolePrmission = await customerDB.RolePermission.bulkCreate(
            permissionArrayObjecct,
            {
                fields: ["roleId", "permissionId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            role,
            rolePrmission,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while UpdateRoleById")
        throw err
    }
}

const Role = {
    getRoles,
    getRoleById,
    createRole,
    UpdateRoleById,
}
export { Role }
