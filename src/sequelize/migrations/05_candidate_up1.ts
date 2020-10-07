import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.addColumn(
            { tableName: "candidate_other_details" },
            "profileImage",
            {
                type: DataTypes.STRING(200),
                allowNull: true,
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.removeColumn(
            { tableName: "candidate_other_details" },
            "profileImage"
        )
    },
}
