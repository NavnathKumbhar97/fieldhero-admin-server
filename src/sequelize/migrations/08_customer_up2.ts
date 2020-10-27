import { QueryInterface, DataTypes, NOW } from "sequelize"
import * as helper from "../../helper"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.addColumn({ tableName: "customer_login" }, "isVerified", {
            type: DataTypes.STRING(20),
            allowNull: true,
        })
    },
    down: async (query: QueryInterface) => {
        await query.removeColumn({ tableName: "customer_login" }, "isVerified")
    },
}
