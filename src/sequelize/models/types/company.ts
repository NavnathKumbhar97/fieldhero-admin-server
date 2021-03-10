import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    companyName: string
    description?: string | null
    isActive?: boolean
    industryId?: number | null
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

export { ModelTypes as CompanyModel }
