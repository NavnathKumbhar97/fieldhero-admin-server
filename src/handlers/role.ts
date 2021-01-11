import { customerDB } from "../sequelize"
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
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getRoles")
        //console.log(err)
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
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getRoleById")
        //console.log(err)
        throw err
    })
    return role
}

const Role = {
    getRoles,
    getRoleById,
}
export { Role }
