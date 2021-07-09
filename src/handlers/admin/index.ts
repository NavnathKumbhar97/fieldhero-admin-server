import prisma from "../../prisma"
import {
    IResponseObject,
    log,
    getHandlerResponseObject,
    httpStatus,
    batch,
} from "../../helper"

const fetchOtherIndustriesCategories = async (): Promise<IResponseObject> => {
    try {
        const candidates = await prisma.candidate.findMany({
            where: {
                status: "OTHER_UPDATE_PENDING",
                OR: [
                    {
                        CandidateCategory: {
                            every: {
                                categoryId: 1,
                            },
                        },
                    },
                    {
                        CandidateIndustry: {
                            every: {
                                industryId: 1,
                            },
                        },
                    },
                    {
                        CandidateWorkHistory: {
                            every: {
                                categoryId: 1,
                            },
                        },
                    },
                    {
                        CandidateWorkHistory: {
                            every: {
                                industryId: 1,
                            },
                        },
                    },
                ],
            },
            // take: 50,
            select: {
                id: true,
                fullName: true,
                gender: true,
                currCity: true,
                currState: true,
                permCity: true,
                permState: true,
                contactNo1: true,
                education: true,
                CandidateCategory: {
                    select: {
                        id: true,
                        title: true,
                        categoryId: true,
                    },
                },
                CandidateIndustry: {
                    select: {
                        id: true,
                        title: true,
                        industryId: true,
                    },
                },
                CandidateWorkHistory: {
                    select: {
                        id: true,
                        categoryId: true,
                        categoryTitle: true,
                        industryId: true,
                        industryTitle: true,
                        company: true,
                    },
                },
                CandidateRawId: {
                    select: {
                        batchId: true,
                    },
                },
            },
        })

        const result: Array<{
            title: string
            type: "INDUSTRY" | "CATEGORY"
            batchNo?: number
            candidates: Array<any>
        }> = []
        candidates.forEach((candidate) => {
            candidate.CandidateIndustry.forEach((industry) => {
                if (industry.industryId === 1) {
                    if (industry.title) {
                        const index = result.findIndex(
                            (x) =>
                                x.title === industry.title &&
                                x.type === "INDUSTRY"
                        )
                        if (index > -1) {
                            result[index].candidates.push({
                                ...candidate,
                            })
                        } else {
                            result.push({
                                title: industry.title,
                                type: "INDUSTRY",
                                batchNo: candidate.CandidateRawId?.batchId,
                                candidates: [
                                    {
                                        ...candidate,
                                    },
                                ],
                            })
                        }
                    }
                }
            })
        })

        return getHandlerResponseObject(true, httpStatus.OK, "", candidates)
    } catch (error) {
        log.error(
            error.message,
            "Error while fetch other industries and categories"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while fetch other industries and categories"
        )
    }
}

interface IUpdateParam {
    mode: "NEW" | "EXISTING"
    type: "CATEGORY" | "INDUSTRY" | "WH_CATEGORY" | "WH_INDUSTRY"
    text?: string
    description?: string
    id?: number
    candidateId: number
    itemIdtoUpdate: number
}
const updateOtherIndustriesCategories = async (
    userLoginId: number,
    param: IUpdateParam
): Promise<IResponseObject> => {
    try {
        let responseId = null
        if (param.type === "CATEGORY") {
            let _category: number | undefined = undefined
            if (param.mode === "NEW") {
                // if text is not available
                if (!param.text)
                    return getHandlerResponseObject(
                        false,
                        httpStatus.Bad_Request,
                        "Text is required"
                    )
                const categoryFound = await prisma.category.findFirst({
                    where: { title: param.text },
                })
                _category = categoryFound?.id
                if (!categoryFound) {
                    const categoryCreated = await prisma.category.create({
                        data: {
                            title: param.text,
                            description: param.description,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    })
                    _category = categoryCreated.id
                }
            } else {
                if (!param.id)
                    return getHandlerResponseObject(
                        false,
                        httpStatus.Bad_Request,
                        "Id is required"
                    )
                _category = param.id
            }
            await prisma.candidateCategory.update({
                where: {
                    id: param.itemIdtoUpdate,
                },
                data: {
                    title: null,
                    CategoryId: {
                        connect: {
                            id: _category,
                        },
                    },
                    ModifiedBy: {
                        connect: {
                            id: userLoginId,
                        },
                    },
                },
            })

            responseId = _category
        }
        if (param.type === "INDUSTRY") {
            let _industry: number | undefined = undefined
            if (param.mode === "NEW") {
                // if text is not available
                if (!param.text)
                    return getHandlerResponseObject(
                        false,
                        httpStatus.Bad_Request,
                        "Text is required"
                    )
                const industryFound = await prisma.industry.findFirst({
                    where: { title: param.text },
                })
                _industry = industryFound?.id
                if (!industryFound) {
                    const industryCreated = await prisma.industry.create({
                        data: {
                            title: param.text,
                            description: param.description,
                            createdBy: userLoginId,
                            modifiedBy: userLoginId,
                        },
                    })
                    _industry = industryCreated.id
                }
            } else {
                if (!param.id)
                    return getHandlerResponseObject(
                        false,
                        httpStatus.Bad_Request,
                        "Id is required"
                    )
                _industry = param.id
            }
            await prisma.candidateIndustry.update({
                where: {
                    id: param.itemIdtoUpdate,
                },
                data: {
                    title: null,
                    IndustryId: {
                        connect: {
                            id: _industry,
                        },
                    },
                    ModifiedBy: {
                        connect: {
                            id: userLoginId,
                        },
                    },
                },
            })

            responseId = _industry
        }
        if (param.type === "WH_CATEGORY") {
            {
                let _category: number | undefined = undefined
                if (param.mode === "NEW") {
                    // if text is not available
                    if (!param.text)
                        return getHandlerResponseObject(
                            false,
                            httpStatus.Bad_Request,
                            "Text is required"
                        )
                    const categoryFound = await prisma.category.findFirst({
                        where: { title: param.text },
                    })
                    _category = categoryFound?.id
                    if (!categoryFound) {
                        const categoryCreated = await prisma.category.create({
                            data: {
                                title: param.text,
                                description: param.description,
                                createdBy: userLoginId,
                                modifiedBy: userLoginId,
                            },
                        })
                        _category = categoryCreated.id
                    }
                } else {
                    if (!param.id)
                        return getHandlerResponseObject(
                            false,
                            httpStatus.Bad_Request,
                            "Id is required"
                        )
                    _category = param.id
                }
                await prisma.candidateWorkHistory.update({
                    where: {
                        id: param.itemIdtoUpdate,
                    },
                    data: {
                        categoryTitle: null,
                        CategoryId: {
                            connect: {
                                id: _category,
                            },
                        },
                        ModifiedBy: {
                            connect: {
                                id: userLoginId,
                            },
                        },
                    },
                })

                responseId = _category
            }
        }
        if (param.type === "WH_INDUSTRY") {
            {
                let _industry: number | undefined = undefined
                if (param.mode === "NEW") {
                    // if text is not available
                    if (!param.text)
                        return getHandlerResponseObject(
                            false,
                            httpStatus.Bad_Request,
                            "Text is required"
                        )
                    const industryFound = await prisma.industry.findFirst({
                        where: { title: param.text },
                    })
                    _industry = industryFound?.id
                    if (!industryFound) {
                        const industryCreated = await prisma.industry.create({
                            data: {
                                title: param.text,
                                description: param.description,
                                createdBy: userLoginId,
                                modifiedBy: userLoginId,
                            },
                        })
                        _industry = industryCreated.id
                    }
                } else {
                    if (!param.id)
                        return getHandlerResponseObject(
                            false,
                            httpStatus.Bad_Request,
                            "Id is required"
                        )
                    _industry = param.id
                }
                await prisma.candidateWorkHistory.update({
                    where: {
                        id: param.itemIdtoUpdate,
                    },
                    data: {
                        industryTitle: null,
                        IndustryId: {
                            connect: {
                                id: _industry,
                            },
                        },
                        ModifiedBy: {
                            connect: {
                                id: userLoginId,
                            },
                        },
                    },
                })

                responseId = _industry
            }
        }
        const count = await prisma.candidate.count({
            where: {
                id: param.candidateId,
                OR: [
                    {
                        CandidateIndustry: {
                            some: {
                                industryId: { equals: 1 },
                            },
                        },
                        CandidateCategory: {
                            some: {
                                categoryId: { equals: 1 },
                            },
                        },
                    },
                ],
            },
        })
        if (count < 1) {
            await prisma.candidate.update({
                where: {
                    id: param.candidateId,
                },
                data: {
                    status: "APPROVAL_PENDING",
                },
            })
            batch.processLastCandidateFromBatch(param.candidateId)
        }

        return getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Updated successfully",
            {
                id: responseId,
            }
        )
    } catch (error) {
        log.error(
            error.message,
            "Error while update other industries and categories"
        )
        return getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while update other industries and categories"
        )
    }
}

const fetchOtherIndustriesCategoriesPassive =
    async (): Promise<IResponseObject> => {
        try {
            const industries = await prisma.industry.findMany({
                select: {
                    id: true,
                    title: true,
                },
            })
            const categories = await prisma.category.findMany({
                select: {
                    id: true,
                    title: true,
                },
            })
            const result = {
                industries,
                categories,
            }
            return getHandlerResponseObject(true, httpStatus.OK, "", result)
        } catch (error) {
            log.error(
                error.message,
                "Error while fetch other industries and categories passive"
            )
            return getHandlerResponseObject(
                false,
                httpStatus.Bad_Request,
                "Error while fetch other industries and categories passive"
            )
        }
    }

const Admin = {
    fetchOtherIndustriesCategories,
    fetchOtherIndustriesCategoriesPassive,
    updateOtherIndustriesCategories,
}

export { Admin }
