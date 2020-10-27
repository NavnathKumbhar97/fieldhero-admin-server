import { QueryInterface, DataTypes, NOW } from "sequelize"
import * as helper from "../../helper"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable("customer_token", {
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
        await query.addColumn({ tableName: "customer_login" }, "resetToken", {
            type: DataTypes.STRING(500),
            allowNull: true,
        })
        await query.addColumn({ tableName: "customer_login" }, "resetExpires", {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: helper.getExpiryTime,
        })
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("customer_token")
        await query.removeColumn({ tableName: "customer_login" }, "resetToken")
        await query.removeColumn(
            { tableName: "customer_login" },
            "resetExpires"
        )
    },
}
