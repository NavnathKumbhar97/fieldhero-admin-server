import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    firstName: string
    middleName: string
    lastName: string
    birthDate: Date
    gender: string
    perm_address: string
    perm_city: string
    perm_state: string
    perm_country: string
    perm_zip: string
    curr_address: string
    curr_city: string
    curr_state: string
    curr_country: string
    curr_zip: string
    email1: string
    email2: string
    contactNo1: string
    contactNo2: string
    aadharNo: string
    isActive: boolean
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CandidateModel }
