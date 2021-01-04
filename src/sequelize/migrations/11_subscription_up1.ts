import { QueryInterface, DataTypes, NOW } from "sequelize"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable(
            { tableName: "subscription_master" },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                planName: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                dataCount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                durationMonths: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
        await query.addColumn(
            { tableName: "customer_subscription" },
            "usedData",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        )
        await query.addColumn(
            { tableName: "customer_subscription" },
            "status",
            {
                type: DataTypes.STRING(20),
                allowNull: false,
            }
        )
        await query.addColumn(
            { tableName: "customer_subscription" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "customer_subscription" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.changeColumn(
            { tableName: "customer_subscription" },
            "allocatedData",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("subscription_master")
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "usedData"
        )
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "status"
        )
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "modifiedOn"
        )
        await query.changeColumn(
            { tableName: "customer_subscription" },
            "allocatedData",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10,
            }
        )
    },
}
