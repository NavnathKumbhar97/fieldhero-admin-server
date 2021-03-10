import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    userId: number
    roleId: number
    email: string
    passwordHash: string
    is_system_generated?: boolean
    resetToken?: string | null
    resetExpires?: Date | null
    createdOn?: Date | null
    modifiedOn?: Date | null
    created_by?: number | null
    modified_by?: number | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as UserLoginModel }
