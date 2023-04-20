import prisma from "../prisma"
import {
    httpStatus,
    log,
    getHandlerResponseObject,
    IResponseObject,
} from "../helper"
import logger from "../logs"
import path from "path"

/**
 * ADD user activity Data
 */

interface createUserActivityParam {
    userName: string
    email: string
    contactNumber: string
    userActivity: string
    operationName: string
    sectionId: number
    dataId: number
    userLoginId:number,
}
const createUserActivity = async (param: createUserActivityParam, sectionId: number) => {
    try {
        const creatUserActivity = await prisma.userActivity.create({
           data: {
            userName: param.userName,
            email: param.email,
            userActivity: param.userActivity,
            operationName: param.operationName,
            sectionId: sectionId,
            dataId: param.dataId,
            userLoginId:param.userLoginId,

        }
        })
        logger.info(new Error(`File Name: ${path.basename(__filename)} | Method Name : createUserActivity |  Message: createUserActivity`))
        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "User Activity added successfully",
            creatUserActivity
        )
    } catch (err: any) {
        console.log(err);
        logger.error(new Error(`File Name: ${path.basename(__filename)} | Method Name : createUserActivitiy |  Message: Error while createUserActivity`))
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create UserActivity"
        )
    }
}

/**
 * Get All Audit Log Section
 * @param param 
 * @returns 
 */

const getAllUserActivity = async () => {

    const userActivityData = await prisma.userActivity.findMany({
        
        orderBy:{
            createdBy:"desc"
        }
    }).catch((err: any) => {
        log.error(err, "Error while getAllUserActivity")
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAllUserActivity"
        )
    })
    return userActivityData
}

const getUserActivityById = async (userId: number) => {

    const userActivityData = await prisma.userActivity.findMany({
        where: {
            // sectionId: sectionId,
            userLoginId: userId
        },
        orderBy:{
            createdBy:"desc"
        }
    }).catch((err: any) => {
        log.error(err, "Error while getAllUserActivity")
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAllUserActivity"
        )
    })
    return userActivityData
}


const getAuditLogById = async (id: number) => {
    const auditLog = await prisma.auditLog.findFirst({
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getAuditLogById")
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAllAuditLogById"
        )
    })
    return auditLog
}

const UserActivity = {
    createUserActivity,
    getAllUserActivity,
    getUserActivityById,
}
export { UserActivity }
