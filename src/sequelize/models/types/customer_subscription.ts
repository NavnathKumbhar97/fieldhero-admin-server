import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    customerId: number
    startDate: Date
    expiryDate: Date
    allocatedData: number
    usedData: number
    status: string
    comment?: string | null
    planName: string
    createdOn?: Date
    modifiedOn?: Date
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CustomerSubscriptionModel }
