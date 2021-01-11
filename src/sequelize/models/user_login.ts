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
            },
            passwordHash: {
                type: DataTypes.STRING(200),
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
