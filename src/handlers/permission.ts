import { customerDB } from "../sequelize"
import { log } from "../helper"

/**
 * Get All Permission
 * @param all
 */

const getPermissions = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const permissions = await customerDB.Permission.findAll({
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getPermission")
        //console.log(err)
        throw err
    })
    return permissions
}

/**
 * Get Permission By Id
 * @param id
 */

const getPermissionsById = async (id: number) => {
    console.log(id, 'id');
    const permission = await customerDB.Permission.findOne({
        where: {
            id:id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getPermissionById")
        //console.log(err)
        throw err
    })
    return permission
}

const Permission = {
    getPermissions,
    getPermissionsById,
}
export { Permission }
