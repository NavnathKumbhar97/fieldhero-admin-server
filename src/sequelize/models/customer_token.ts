import { DataTypes, Sequelize } from "sequelize"
import { CustomerTokenModel } from "./types"
export const CustomerTokenFactory = (orm: Sequelize): CustomerTokenModel => {
    return <CustomerTokenModel>orm.define(
        "customer_token",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            token: {
                type: DataTypes.STRING(500),
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
