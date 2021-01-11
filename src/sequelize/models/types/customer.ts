import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    fullName: string
    companyName?: string | null
    birthDate?: Date | null
    gender?: string | null
    state?: string | null
    country?: string | null
    profileImage?: string | null
    isActive?: boolean | null
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CustomerModel }
