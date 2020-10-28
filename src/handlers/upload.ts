import fs from "fs"
import path from "path"
import { customerDB } from "../sequelize"
import { log } from "../helper"
/*
 * Upload Candiate Profile By Id
 */
const updateCandidateProfileById = async (id: number, profileImage: string) => {
    const CandidateProfile = await customerDB.CandidateOtherDetails.findOne({
        where: { candidateId: id },
    })
    let updatedCandidateProfile = null
    if (CandidateProfile) {
        const imagePath = CandidateProfile.profileImage
        fs.unlink(path.join(process.cwd(), imagePath || ""), (err) => {
            return err;
        })
        CandidateProfile.profileImage = profileImage
        updatedCandidateProfile = await CandidateProfile.save()
        .catch((err:any)=>{
            log.error(err, "Error while update profile")
            //console.log(err)
            throw err;
        })
    }
    return updatedCandidateProfile
}

const UploadImage = {
    updateCandidateProfileById,
}

export { UploadImage }
