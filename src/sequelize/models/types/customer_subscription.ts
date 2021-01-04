import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    customerId: number
    startDate: Date
    expiryDate: Date
    allocatedData: number
    usedData: number
    status: string
    createdOn?: Date | null
    modifiedOn?: Date | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as CustomerSubscriptionModel }
