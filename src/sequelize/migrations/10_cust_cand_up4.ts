import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.changeColumn("candidate_master", "firstName", {
            type: DataTypes.STRING(45),
            allowNull: true,
        })
    },
    down: async (query: QueryInterface) => {
        await query.changeColumn("candidate_master", "firstName", {
            type: DataTypes.STRING(45),
            allowNull: false,
        })
    },
}
