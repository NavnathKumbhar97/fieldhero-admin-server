import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable("customer_master", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            fullName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            companyName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING(6),
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
        })
        await query.createTable("customer_login", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING(80),
                allowNull: false,
            },
            passwordHash: {
                type: DataTypes.STRING(200),
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
        })
        await query.createTable("customer_subscription", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            customerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "customer_master",
                    key: "id",
                },
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            expiryDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            allocatedData: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
        })
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("customer_master")
        await query.dropTable("customer_login")
        await query.dropTable("customer_subscription")
    },
}
