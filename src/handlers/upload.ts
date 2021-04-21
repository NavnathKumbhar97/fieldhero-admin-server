import fs from "fs"
import path from "path"
// local imports
import * as helper from "../helper"
import prisma from "../prisma"

const { log, httpStatus } = helper
/*
 * Upload Candiate Profile By Id
 */
const updateCandidateProfileById = async (
    id: number,
    profileImage: string
): Promise<helper.IResponseObject> => {
    try {
        const candidateOtherFound = await prisma.candidateOther.findFirst({
            where: {
                candidateId: id,
            },
        })
        if (!candidateOtherFound)
            return helper.getHandlerResponseObject(
                false,
                httpStatus.Not_Found,
                "Candidate not found"
            )
        // delete old file
        fs.unlink(
            path.join(process.cwd(), candidateOtherFound.profileImage || ""),
            (err) => {
                return err
            }
        )

        const candidateOther = await prisma.candidateOther.updateMany({
            where: {
                id: candidateOtherFound.id,
            },
            data: {
                profileImage,
            },
        })

        return helper.getHandlerResponseObject(
            true,
            httpStatus.OK,
            "Profile image updated successfully",
            candidateOther
        )
    } catch (error) {
        log.error(error.message, "Error while updateCandidateProfileById")
        return helper.getHandlerResponseObject(
            false,
            httpStatus.Bad_Request,
            "Error while updateCandidateProfileById"
        )
    }
}

const UploadImage = {
    updateCandidateProfileById,
}

export { UploadImage }
