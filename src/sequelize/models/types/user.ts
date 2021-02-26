import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    fullName: string
    birthDate?: Date | null
    gender?: "male" | "female" | "other" | null
    address?: string | null
    state?: string | null
    country?: string | null
    pan_card?: string | null
    profileImage?: string | null
    uuid: string
    isActive?: boolean
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

export { ModelTypes as UserModel }
