import fs from "fs"
import path from "path"
import { customerDB } from "../sequelize"
import { Candidate } from "./candidate"

const updateCandidateProfileById = async (id: number, profileImage: string) => {
    let CandidateProfile = await customerDB.CandidateOtherDetails.findOne({
        where: { candidateId: id },
    })
    let updatedCandidateProfile = null
    if (CandidateProfile) {
        let imagePath = CandidateProfile.profileImage
        fs.unlink(path.join(process.cwd(), imagePath || ""), (err) => {
            return err;
        })
        CandidateProfile.profileImage = profileImage
        updatedCandidateProfile = await CandidateProfile.save()
    }
    return updatedCandidateProfile
}

const UploadImage = {
    updateCandidateProfileById,
}

export { UploadImage }
