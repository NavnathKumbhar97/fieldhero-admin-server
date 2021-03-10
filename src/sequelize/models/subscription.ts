import { DataTypes, Sequelize } from "sequelize"
import { SubscriptionModel } from "./types"
export const SubscriptionFactory = (orm: Sequelize): SubscriptionModel => {
    return <SubscriptionModel>orm.define(
        "subscription_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            planName: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            },
            dataCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            durationMonths: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
            },
            note: {
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
