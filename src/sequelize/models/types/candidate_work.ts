import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id: number,
    startDate: Date,
    endDate: Date,
    description: string,
    candidateId: number,
    companyId: number,
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateWorkModel }
