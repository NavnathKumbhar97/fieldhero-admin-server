import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    userId?: number
    roleId: number
    email: string
    passwordHash: string
    createdOn?: Date | null
    modifiedOn?: Date | null
    resetToken?: string | null
    resetExpires?: Date | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as UserLoginModel }
