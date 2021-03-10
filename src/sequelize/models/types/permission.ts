import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    name: string
    description?: string | null
    displayName: string
    group: string
    isActive?: boolean
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as PermissionModel }
