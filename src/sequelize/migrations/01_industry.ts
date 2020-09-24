import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable("industry_type_master", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(45),
                unique: true,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
        })
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("industry_type_master")
    },
}
