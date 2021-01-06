import { Model, BuildOptions } from "sequelize"

interface Attributes {
    id?: number
    planName: string
    dataCount: number
    durationMonths: number
    isActive: boolean
    price: number
    note?: string | null
    createdOn?: Date | null
    modifiedOn?: Date | null
}

interface CustomModel extends Model<Attributes>, Attributes {}

// class Industry extends Model<IndustryModel, IndustryAttributes> {}

type ModelTypes = typeof Model & {
    new (values?: Record<string, unknown>, options?: BuildOptions): CustomModel
}

export { ModelTypes as SubscriptionModel }
