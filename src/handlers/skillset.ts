// local imports
import { Prisma } from ".prisma/client"
import path from "path"
import logger from "../logs"
import * as helper from "../helper"

import prisma from "../prisma"
const { log, httpStatus } = helper
/*
 * Get All Skills
 */
const getSkills = async (all: string,take:any,skip:any): Promise<helper.IResponseObject> => {
    try {
        let whereCondition: true | undefined = true
        if (all == "*") whereCondition = undefined
        const page = ""?1:parseInt(skip)
        const limit = ""?10:parseInt(take)

        const count = await prisma.skill.count({
            where: {
                id: undefined,
            },
        })


        const skills = await prisma.skill.findMany({take: limit, skip:page,
            where: {
                isActive: whereCondition,
            },
            orderBy: {
                title: "asc",
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : getSkills | Message: Role updated successfully.`);

        return helper.getHandlerResponseObject(true, httpStatus.OK, "", {skills,count})
    } catch (error: any) {
        log.error(error.message, "Error while getSkills")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getSkills | Message: Error while getSkills.`);

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
        if (!skill){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : getSkillById | Message: Skill not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Skill not found"
                )
            }
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : getSkillById | Message: Skill fetched by id successfully.`);
        return helper.getHandlerResponseObject(true, httpStatus.OK, "", skill)
    } catch (error: any) {
        log.error(error.message, "Error while getSkillById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : getSkillById | Message: Error while getSkillById.`);

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
        if (skillFound){
            logger.warn(`File Name: ${path.basename(__filename)} | Method Name : createSkill | Message: Skill already exist.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Conflict,
                "Skill already exist"
                )
            }

        const skill = await prisma.skill.create({
            data: {
                title: param.title,
                description: param.description,
                isActive: "isActive" in param ? param.isActive : undefined,
                createdBy: userLoginId,
                modifiedBy: userLoginId,
            },
        })
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : createSkill | Message: Skill created successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.Created,
            "Skill created successfully",
            skill
        )
    } catch (error: any) {
        log.error(error.message, "Error while createSkill")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : createSkill | Message: Error while createSkill.`);

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
        if (!skillFound){
            logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateSkillById | Message: Skill not found.`);

            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Skill not found"
                )
            }

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
        logger.info(`File Name: ${path.basename(__filename)} | Method Name : updateSkillById | Message: Skill updated successfully.`);

        return helper.getHandlerResponseObject(
            true,
            httpStatus.No_Content,
            "Skill updated successfully",
            skill
        )
    } catch (error: any) {
        log.error(error.message, "Error while updateSkillById")
        logger.error(`File Name: ${path.basename(__filename)} | Method Name : updateSkillById | Message: Error while updateSkillById.`);

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
