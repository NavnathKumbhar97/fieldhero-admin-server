import { QueryInterface, DataTypes } from "sequelize"

module.exports = {
    up: async (query: QueryInterface) => {
        await query.changeColumn(
            { tableName: "subscription_master" },
            "planName",
            {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            }
        )
        await query.changeColumn(
            { tableName: "subscription_master" },
            "dataCount",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        )
        await query.changeColumn(
            { tableName: "subscription_master" },
            "durationMonths",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            }
        )
        await query.addColumn({ tableName: "subscription_master" }, "price", {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        })
        await query.addColumn({ tableName: "subscription_master" }, "note", {
            type: DataTypes.STRING(200),
            allowNull: true,
        })

        await query.addColumn(
            { tableName: "customer_subscription" },
            "comment",
            {
                type: DataTypes.STRING(200),
                allowNull: true,
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.changeColumn(
            { tableName: "subscription_master" },
            "planName",
            {
                type: DataTypes.STRING(40),
                allowNull: false,
            }
        )
        await query.changeColumn(
            { tableName: "subscription_master" },
            "dataCount",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        )
        await query.changeColumn(
            { tableName: "subscription_master" },
            "durationMonths",
            {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        )
        await query.removeColumn({ tableName: "subscription_master" }, "price")
        await query.removeColumn({ tableName: "subscription_master" }, "note")
        await query.removeColumn(
            { tableName: "customer_subscription" },
            "comment"
        )
    },
}
