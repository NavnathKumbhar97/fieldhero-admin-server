import { DataTypes, Sequelize } from "sequelize"
import { UserLoginModel } from "./types"
export const UserLoginFactory = (orm: Sequelize): UserLoginModel => {
    return <UserLoginModel>orm.define(
        "user_login",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "user_master",
                    key: "id",
                },
                allowNull: false,
            },
            roleId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "role_master",
                    key: "id",
                },
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(80),
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            is_system_generated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            resetToken: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            resetExpires: {
                type: DataTypes.DATE,
                allowNull: true,
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
