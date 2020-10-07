import { customerDB } from "../sequelize"


const updateCandiateProfileById = async (id:number, profileImage:string) => {
    const CandiateProfile = await customerDB.CandidateOtherDetails.findOne({
        where: { candidateId: id },
    })
    let updatedCandiateProfile = null
    if (CandiateProfile) {
        CandiateProfile.profileImage = profileImage
        updatedCandiateProfile = await CandiateProfile.save()
    }
    return updatedCandiateProfile
}

const UploadImage = {
    updateCandiateProfileById,
}

export { UploadImage }
