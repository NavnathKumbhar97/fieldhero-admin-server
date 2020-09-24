import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable("candidate_master", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            middleName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_address: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            perm_city: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_state: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_country: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_zip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_address: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            curr_city: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_state: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_country: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_zip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            email1: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            email2: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            contactNo1: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            contactNo2: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            aadharNo: {
                type: DataTypes.STRING(12),
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
        await query.dropTable("candidate_master")
    },
}
