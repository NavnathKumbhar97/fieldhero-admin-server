import { DataTypes, Sequelize } from "sequelize"
import { CustomerModel } from "./types"
export const CustomerFactory = (orm: Sequelize): CustomerModel => {
    return <CustomerModel>orm.define(
        "customer_master",
        {
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
            createdOn: {
                type: DataTypes.DATE,
            },
            modifiedOn: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: true,
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
            deletedAt: false,
        }
    )
}
