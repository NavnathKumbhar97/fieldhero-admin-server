import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    startDate?: Date | null
    endDate?: Date | null
    description?: string | null
    candidateId: number
    companyId?: number | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateWorkModel }
