import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    candidate_id: number
    industry_id?: number | null
    category?: string | null
    pref_location_1?: string | null
    pref_location_2?: string | null
    pref_location_3?: string | null
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

export { ModelTypes as CandidateJobPreferenceModel }
