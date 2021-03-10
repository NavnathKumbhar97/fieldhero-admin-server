import { DataTypes, Sequelize } from "sequelize"
// local imports
import * as helper from "../../helper"
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
                type: DataTypes.STRING(200),
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
                type: DataTypes.ENUM,
                values: helper.getGender(),
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            country: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            createdOn: {
                type: DataTypes.DATE,
            },
            modifiedOn: {
                type: DataTypes.DATE,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "user_login",
                    key: "id",
                },
            },
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "user_login",
                    key: "id",
                },
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
