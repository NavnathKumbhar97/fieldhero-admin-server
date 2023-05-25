// local imports
import path from "path"
import logger from "../logs"
import * as helper from "../helper"
import prisma from "../prisma"
import { IResponseObject, getHandlerResponseObject } from "../helper"

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
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getPermissions | Message: permissions fetched successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            permissions
        )
    } catch (error: any) {
        log.error(error.message, "Error while getPermissions")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getPermissions | Message: Error while getPermissions.`);

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
        if (!permission){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : getPermissionsById | Message: Permission not found.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Permission not found"
                )
            }

        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getPermissionsById | Message: permissions fetched by id successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "",
            permission
        )
    } catch (error: any) {
        log.error(error.message, "Error while getPermissionsById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getPermissionsById | Message: Error while getPermissionsById.`);

        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getPermissionsById"
        )
    }
}

interface ICreateParam {
    name: string
    description: string
    displayName: string
    group: string
    createdOn?: string
    isActive?: boolean
}
const create = async (
    param: ICreateParam
): Promise<IResponseObject> => {
    try {
        if (!param.name){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : create | Message: Title is required.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Permission name is required"
            )}
        const permissionFound = await prisma.permission.findFirst({
            where: {
                name: param.name,
            },
        })
        if (permissionFound){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : create | Message: Category already exist.`);
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Permission name is already exist"
            )}

        const permission = await prisma.permission.create({
            data: {
                name: param.name,
                description: param.description,
                displayName: param.displayName,
                group: param.group,
                isActive: "isActive" in param ? param.isActive : true,
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : create | Message: permission created successfully.`);

        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "permission created successfully",
            permission
        )
    } catch (error: any) {
        log.error(error.message, "Error while create permission")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : create | Message: Error while create permission.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create category"
        )
    }
}


const Permission = {
    getPermissions,
    getPermissionsById,create
}
export { Permission }
