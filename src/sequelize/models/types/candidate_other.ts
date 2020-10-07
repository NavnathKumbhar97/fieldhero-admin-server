import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId?: number
    profileImage?: string
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateOtherModel }
