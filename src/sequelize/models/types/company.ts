import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id: number
    companyName: string
    description: string
    isActive: boolean
    industryId: number
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CompanyModel }
