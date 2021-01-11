import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.addColumn(
            { tableName: "customer_subscription" },
            "planName",
            {
                type: DataTypes.STRING(40),
                allowNull: false,
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "planName"
        )
    },
}
