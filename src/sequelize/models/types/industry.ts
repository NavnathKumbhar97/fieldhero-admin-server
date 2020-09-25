import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    title: string
    description: string
    isActive: boolean
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as IndustryModel }
