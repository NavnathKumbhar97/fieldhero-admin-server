import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.addColumn({ tableName: "candidate_master" }, "fullName", {
            type: DataTypes.STRING(200),
            allowNull: false,
        })
        await query.addColumn({ tableName: "customer_login" }, "newEmail", {
            type: DataTypes.STRING(80),
            allowNull: true,
            defaultValue: null,
        })
        await query.addColumn(
            { tableName: "customer_login" },
            "newEmailToken",
            {
                type: DataTypes.STRING(500),
                allowNull: true,
                defaultValue: null,
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.removeColumn({ tableName: "candidate_master" }, "fullName")
        await query.removeColumn({ tableName: "customer_login" }, "newEmail")
        await query.removeColumn(
            { tableName: "customer_login" },
            "newEmailToken"
        )
    },
}
