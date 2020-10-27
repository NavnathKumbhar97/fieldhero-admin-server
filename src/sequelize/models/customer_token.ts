import { DataTypes, Sequelize, NOW } from "sequelize"
import { CustomerTokenModel } from "./types"
export const CustomerTokenFactory = (orm: Sequelize): CustomerTokenModel => {
    return <CustomerTokenModel>orm.define("customer_token", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING(500),
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: NOW,
        },
    })
}
