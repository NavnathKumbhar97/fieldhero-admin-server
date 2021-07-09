// local imports
import prisma from "../prisma"
import {
    httpStatus,
    log,
    getHandlerResponseObject,
    IResponseObject,
} from "../helper"

//* fetch all categories
const fetchAll = async (all: string): Promise<IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all === "*") whereCondition = undefined

        const categories = await prisma.category.findMany({
            where: { isActive: whereCondition },
            select: {
                id: true,
                title: true,
                description: true,
                isActive: true,
            },
            orderBy: { title: "asc" },
        })
        return getHandlerResponseObject(true, httpStatus.OK, "", categories)
    } catch (error) {
        log.error(error.message, "Error while fetch all categories")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch all categories"
        )
    }
}

const fetchById = async (id: number): Promise<IResponseObject> => {
    try {
        const category = await prisma.category.findFirst({
            where: { id },
            include: {
                CreatedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
                ModifiedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        })
        if (!category)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Category not found"
            )
        const { CreatedBy, ModifiedBy, ...other } = category
        const result = {
            ...other,
            CreatedBy: CreatedBy?.User.fullName,
            ModifiedBy: ModifiedBy?.User.fullName,
        }
        return getHandlerResponseObject(true, httpStatus.OK, "", result)
    } catch (error) {
        log.error(error.message, "Error while fetch category by id")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch category by id"
        )
    }
}

interface ICreateParam {
    title: string
    description?: string
    isActive?: boolean
}
const create = async (
    userloginId: number,
    param: ICreateParam
): Promise<IResponseObject> => {
    try {
        const categoryFound = await prisma.category.findFirst({
            where: {
                title: param.title,
            },
        })
        if (categoryFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Category already exist"
            )

        const category = await prisma.category.create({
            data: {
                title: param.title.toUpperCase(),
                description: param.description,
                isActive: "isActive" in param ? param.isActive : true,
                createdBy: userloginId,
                modifiedBy: userloginId,
            },
        })

        return getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Category created successfully",
            category
        )
    } catch (error) {
        log.error(error.message, "Error while create category")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while create category"
        )
    }
}

interface IUpdateParam {
    id: number
    title: string
    description?: string
    isActive?: boolean
}
const updateById = async (
    userLoginId: number,
    param: IUpdateParam
): Promise<IResponseObject> => {
    try {
        const categoryFound = await prisma.category.findFirst({
            where: {
                id: param.id,
            },
        })
        if (!categoryFound)
            return getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Category not found"
            )
        const category = await prisma.category.update({
            where: {
                id: param.id,
            },
            data: {
                title: param.title.toUpperCase(),
                description: param.description || undefined,
                isActive: "isActive" in param ? param.isActive : undefined,
                modifiedBy: userLoginId,
            },
        })

        return getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Category updated successfully",
            category
        )
    } catch (error) {
        log.error(error.message, "Error while update category by id")
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while update category by id"
        )
    }
}

const Category = {
    fetchAll,
    fetchById,
    create,
    updateById,
}

export { Category }
