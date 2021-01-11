import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    companyName: string
    description?: string | null
    isActive?: boolean | null
    industryId?: number | null
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CompanyModel }
