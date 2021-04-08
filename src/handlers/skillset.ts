// local imports
import { Prisma } from ".prisma/client"
import * as helper from "../helper"

import prisma from "../prisma"
const { log, httpStatus } = helper
/*
 * Get All Skills
 */
const getSkills = async (all: string): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined

        const skills = await prisma.skill.findMany({
            where: {
                isActive: whereCondition,
            },
            orderBy: {
                title: "asc",
            },
        })

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", skills)
    } catch (error) {
        log.error(error.message, "Error while getSkills")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getSkills"
        )
    }
}

/*
 * Get Skill Details By Id
 */
const getSkillById = async (id: number): Promise<helper.IResponseObject> => {
    try {
        const skill = await prisma.skill.findFirst({
            where: { id },
        })
        if (!skill)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Skill not found"
            )

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", skill)
    } catch (error) {
        log.error(error.message, "Error while getSkillById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while getSkillById"
        )
    }
}
/*
 * Create Skill
 */
interface createSkillSetParam {
    title: string
    description: string
    isActive: boolean
}

const createSkill = async (
    userLoginId: number,
    param: createSkillSetParam
): Promise<helper.IResponseObject> => {
    try {
        const skillFound = await prisma.skill.findFirst({
            where: {
                title: param.title,
            },
        })
        if (skillFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Skill already exist"
            )

        const skill = await prisma.skill.create({
            data: {
                title: param.title,
                description: param.description,
                isActive: "isActive" in param ? param.isActive : undefined,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Skill created successfully",
            skill
        )
    } catch (error) {
        log.error(error.message, "Error while createSkill")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while createSkill"
        )
    }
}
/*
 * Update SkillSets Details
 */
interface updateSkillSetParam {
    id: number
    title: string
    description: string
    isActive: boolean
}

const updateSkillById = async (
    userLoginId: number,
    param: updateSkillSetParam
): Promise<helper.IResponseObject> => {
    try {
        const skillFound = await prisma.skill.findFirst({
            where: { id: param.id },
        })
        if (!skillFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Skill not found"
            )

        const skill = await prisma.skill.update({
            where: {
                id: param.id,
            },
            data: {
                title: param.title,
                description: param.description,
                isActive: "isActive" in param ? param.isActive : undefined,
                modifiedBy: userLoginId,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Skill updated successfully",
            skill
        )
    } catch (error) {
        log.error(error.message, "Error while updateSkillById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateSkillById"
        )
    }
}

const SkillSet = {
    getSkills,
    getSkillById,
    createSkill,
    updateSkillById,
    // deleteSkillSetById,
}

export { SkillSet }
