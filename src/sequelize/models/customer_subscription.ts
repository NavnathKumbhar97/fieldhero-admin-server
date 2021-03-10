import { DataTypes, Sequelize } from "sequelize"
import { CustomerSubscriptionModel } from "./types"
export const CustomerSubscriptionFactory = (
    orm: Sequelize
): CustomerSubscriptionModel => {
    return <CustomerSubscriptionModel>orm.define(
        "customer_subscription",
        {
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
            planName: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            allocatedData: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            usedData: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            createdOn: {
                type: DataTypes.DATE,
            },
            modifiedOn: {
                type: DataTypes.DATE,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "user_login",
                    key: "id",
                },
            },
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "user_login",
                    key: "id",
                },
            },
        },
        {
            timestamps: true,
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
            deletedAt: false,
        }
    )
}
