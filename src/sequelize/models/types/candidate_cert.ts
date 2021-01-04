import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    type: string
    title: string
    issueDate?: Date | null
    issuedBy?: string | null
    description?: string | null
    candidateId: number
    skillId?: number | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateCertificateModel }
