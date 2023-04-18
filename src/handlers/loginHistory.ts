// local imports
import prisma from "../prisma"
import {
    httpStatus,
    log,
    getHandlerResponseObject,
    IResponseObject,
} from "../helper"
import logger from "../logs"
import path from "path"

//* fetch all categories
// const fetchAll = async (all:any,take:any,skip:any): Promise<IResponseObject> => {
//     try {
//         let whereCondition: true | undefined = true
//         if (all === "*") whereCondition = undefined
//         const page = ""?1:parseInt(skip)
//         const limit = ""?10:parseInt(take)

//         const count = await prisma.category.count({
//             where: {
//                 createdBy: undefined,
//             },
//         })

//         const categories = await prisma.category.findMany({
//             take:limit,
//             skip:page,
//             where: { isActive: whereCondition },
//             select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 isActive: true,
//             },
//             orderBy: { title: "asc" },
//         })
//         logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchAll | Message: Categories fetched successfully.`);

//         return getHandlerResponseObject(true, httpStatus.OK, "", {categories,count})
//     } catch (error: any) {
//         log.error(error.message, "Error while fetch all categories")
//         logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchAll | Message: Error while fetch all categories.`);

//         return getHandlerResponseObject(
//             false,
//             httpStatus.Bad_Request,
//             "Error while fetch all categories"
//         )
//     }
// }
// //* fetch all categories
// const fetchAllForFilter = async (all:any,take:any,skip:any): Promise<IResponseObject> => {
//     try {
//         let whereCondition: true | undefined = true
//         if (all === "*") whereCondition = undefined
//         const page = ""?1:parseInt(skip)
//         const limit = ""?10:parseInt(take)

//         const count = await prisma.category.count({
//             where: {
//                 createdBy: undefined,
//             },
//         })

//         const categories = await prisma.category.findMany({
//             // take:limit,
//             // skip:page,
//             where: { isActive: whereCondition },
//             select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 isActive: true,
//             },
//             orderBy: { title: "asc" },
//         })
//         logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchAll | Message: Categories fetched successfully.`);

//         return getHandlerResponseObject(true, httpStatus.OK, "", {categories,count})
//     } catch (error: any) {
//         log.error(error.message, "Error while fetch all categories")
//         logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchAll | Message: Error while fetch all categories.`);

//         return getHandlerResponseObject(
//             false,
//             httpStatus.Bad_Request,
//             "Error while fetch all categories"
//         )
//     }
// }

const fetchById = async (userLoginId: any,take:any,skip:any): Promise<IResponseObject> => {
    try {
        const loginUser = await prisma.loginHistory.findMany({
            take:take,skip:skip,
            where: { userLoginId },
            orderBy: {
                loggedInTime: "desc",
            },
            
        })
        if (!loginUser){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : fetchById | Message: User Login History not found.`);
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "User history not found"
            )
        }
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : fetchById | Message: User Login history fetched by id successfully.`);
        return getHandlerResponseObject(true, httpStatus.OK, "", loginUser)
    } catch (error: any) {
        log.error(error.message, "Error while fetch category by id")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : fetchById | Message: Error while fetch category by id.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch category by id"
        )
    }
}

interface ICreateParam {
    loggedInTime: any
    email: any
    userName: any
}
const create = async (
    userloginId: number,
    param: ICreateParam
): Promise<IResponseObject> => {
    try {
        const loggedHis = await prisma.loginHistory.findFirst({
            where: {
                userName: param.userName,
                email:param.email,
                loggedInTime:param.loggedInTime

            },
        }) 

        const userHistory = await prisma.loginHistory.create({
            data: {
                userName: param.userName,
                email:param.email,
                loggedInTime:param.loggedInTime,
                createdBy: userloginId,
                userLoginId:userloginId
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : create | Message: User History created successfully.`);

        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "User History created successfully",
            userHistory
        )
    } catch (error: any) {
        log.error(error.message, "Error while create category")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : create | Message: Error while create category.`);
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create user history"
        )
    }
}

// interface IUpdateParam {
//     id: number
//     title: string
//     description?: string
//     isActive?: boolean
// }
// const updateById = async (
//     userLoginId: number,
//     param: IUpdateParam
// ): Promise<IResponseObject> => {
//     try {
//         const categoryFound = await prisma.category.findFirst({
//             where: {
//                 id: param.id,
//             },
//         })
//         if (!categoryFound){
//             logger.warn(`File Name: ${path.basename(__filename)} | Method Name : updateById | Message: Category not found.`);
//             return getHandlerResponseObject(
//                 false,
//                 httpStatus.Not_Found,
//                 "Category not found"
//             )}
//         if (!param.title){
//             logger.warn(`File Name: ${path.basename(__filename)} | Method Name : updateById | Message: Title is required.`);
//             return getHandlerResponseObject(
//                 false,
//                 httpStatus.Conflict,
//                 "Title is required"
//                 )
//             }
//         const category = await prisma.category.update({
//             where: {
//                 id: param.id,
//             },
//             data: {
//                 title: param.title.toUpperCase(),
//                 description: param.description || undefined,
//                 isActive: "isActive" in param ? param.isActive : undefined,
//                 modifiedBy: userLoginId,
//             },
//         })
//         logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateById | Message: Category updated successfully.`);
//         return getHandlerResponseObject(
//             true,
//             httpStatus.No_Content,
//             "Category updated successfully",
//             category
//         )
//     } catch (error: any) {
//         log.error(error.message, "Error while update category by id")
//         logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateById | Message: Error while update category by id.`);
//         return getHandlerResponseObject(
//             false,
//             httpStatus.Bad_Request,
//             "Error while update category by id"
//         )
//     }
// }

const loginHistory = {
    // fetchAll,
    fetchById,
    create,
    // updateById,
    // fetchAllForFilter
}

export { loginHistory }
