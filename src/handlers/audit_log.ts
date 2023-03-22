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
 * ADD Audit Data
 */

interface createAuditLogParam {
    userName: string
    email: string
    contactNumber: string
    updatedFiled: string
    operationName: string
    sectionNameId: number
    sectionDataId: number
}
const createAuditLog = async (param: createAuditLogParam, sectionId: number, dataId: number) => {
    try {
        const creatAuditLog = await prisma.auditLog.create({
           data: {
            userName: param.userName,
            email: param.email,
            contactNumber: param.contactNumber,
            updatedFiled: param.updatedFiled,
            operationName: param.operationName,
            sectionNameId: sectionId,
            sectionDataId: dataId,
        }
        })
        logger.info(new Error(`File Name: ${path.basename(__filename)} | Method Name : createAuditLog |  Message: createAuditLog`))
        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Audit Log added successfully",
            creatAuditLog
        )
    } catch (err: any) {
        console.log(err);
        logger.error(new Error(`File Name: ${path.basename(__filename)} | Method Name : createApprover |  Message: Error while createAuditLog`))
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create AuditLog"
        )
    }
}

/**
 * Get All Audit Log Section
 * @param param 
 * @returns 
 */

const getAllAuditLog = async (sectionId: number, dataId: number) => {

    const approval = await prisma.auditLog.findMany({
        where: {
            sectionNameId: sectionId,
            sectionDataId: dataId
        },
        orderBy:{
            "modifiedOn":"desc"
        }
    }).catch((err: any) => {
        log.error(err, "Error while getAllAuditLog")
        // throw err
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getAllAuditLog"
        )
    })
    return approval
}


// const getAuditLogById = async (id: number) => {
//     const auditLog = await CasaDB.AuditLog.findOne({
//         attributes: [
//             "id",
//             "userName",
//             "email",
//             "contactNumber",
//             "updatedFiled",
//             "operationName",
//             "sectionNameId",
//             "sectionDataId",
//             "createdOn",
//             "modifiedOn"
//         ],
//         where: {
//             id,
//         },
//     }).catch((err: any) => {
//         log.error(err, "Error while getAuditLogById")
//         throw err
//     })
//     return auditLog
// }

const AuditLog = {
    createAuditLog,
    getAllAuditLog,
    // getAuditLogById,
}
export { AuditLog }
