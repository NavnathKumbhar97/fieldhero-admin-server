import { DataTypes, Sequelize } from "sequelize"
import { CustomerSubscriptionModel } from "./types"
export const CustomerSubscriptionFactory = (
    orm: Sequelize
): CustomerSubscriptionModel => {
    return <CustomerSubscriptionModel>orm.define("customer_subscription", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "customer_master",
                key: "id",
            },
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        expiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        allocatedData: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10,
        },
    })
}
