import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    customerId: number
    startDate: Date
    expiryDate: Date
    planName: string
    allocatedData?: number
    usedData?: number
    status: string
    comment?: string | null
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

export { ModelTypes as CustomerSubscriptionModel }
