import { QueryInterface, DataTypes } from "sequelize"

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
