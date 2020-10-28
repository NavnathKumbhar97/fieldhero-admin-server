import { DataTypes, Sequelize } from "sequelize"
import { CustomerLoginModel } from "./types"
import * as helper from "../../helper"
export const CustomerLoginFactory = (orm: Sequelize): CustomerLoginModel => {
    return <CustomerLoginModel>orm.define("customer_login", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING(80),
            allowNull: false,
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
        isVerified: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
    })
}
