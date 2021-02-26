import { DataTypes, Sequelize } from "sequelize"
import { CustomerLoginModel } from "./types"
import * as helper from "../../helper"
export const CustomerLoginFactory = (orm: Sequelize): CustomerLoginModel => {
    return <CustomerLoginModel>orm.define(
        "customer_login",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(80),
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            customerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "customer_master",
                    key: "id",
                },
            },
            resetToken: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            resetExpires: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: helper.getExpiryTime,
            },
            status: {
                type: DataTypes.ENUM,
                values: ["pending", "verified"],
                defaultValue: "pending",
                allowNull: true,
            },
            newEmail: {
                type: DataTypes.STRING(80),
                allowNull: true,
            },
            newEmailToken: {
                type: DataTypes.STRING(500),
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
