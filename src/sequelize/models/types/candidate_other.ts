import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    totalExpMonths?: number | null
    totalExpYears?: number | null
    registrationStatus?: string | null
    candidateId: number
    profileImage?: string | null
    createdOn?: Date
    modifiedOn?: Date
    created_by?: number | null
    modified_by?: number | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateOtherModel }
