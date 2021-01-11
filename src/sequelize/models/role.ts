import { DataTypes, Sequelize } from "sequelize"
import { RoleModel } from "./types"
export const RoleFactory = (orm: Sequelize): RoleModel => {
    return <RoleModel>orm.define(
        "role_master",
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
            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
