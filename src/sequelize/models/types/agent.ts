import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    user_id: number
    prof_status?: string | null
    gstin?: string | null
    company_name?: string | null
    note?: string | null
    status: "pending" | "registered"
    approved_on?: Date | null
    approved_by?: number | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as AgentModel }
