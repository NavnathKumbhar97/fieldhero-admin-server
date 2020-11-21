import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    email: string
    passwordHash: string
    customerId: number
    resetToken?: string
    resetExpires?: Date
    newEmail?: string
    newEmailToken?: string
    isVerified?: string
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CustomerLoginModel }
