import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    fullName: string
    firstName?: string | null
    middleName?: string | null
    lastName?: string | null
    birthDate?: Date | null
    gender?: "male" | "female" | "transgender" | null
    perm_address?: string | null
    perm_city?: string | null
    perm_state?: string | null
    perm_country?: string | null
    perm_zip?: string | null
    curr_address?: string | null
    curr_city?: string | null
    curr_state?: string | null
    curr_country?: string | null
    curr_zip?: string | null
    email1?: string | null
    email2?: string | null
    contactNo1?: string | null
    contactNo2?: string | null
    aadharNo?: string | null
    isActive?: boolean | null
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateModel }
