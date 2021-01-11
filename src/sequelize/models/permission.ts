import { DataTypes, Sequelize } from "sequelize"
import { PermissionModel } from "./types"
export const PermissionFactory = (orm: Sequelize): PermissionModel => {
    return <PermissionModel>orm.define(
        "permission_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            displayName: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            group: {
                type: DataTypes.STRING(30),
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
        },
        {
            timestamps: true,
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
            deletedAt: false,
        }
    )
}
