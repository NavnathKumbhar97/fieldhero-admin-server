import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    email: string
    passwordHash: string
    customerId: number
    resetToken?: string | null
    resetExpires?: Date | null
    newEmail?: string | null
    newEmailToken?: string | null
    isVerified?: string | null
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CustomerLoginModel }
