import { DataTypes, Sequelize } from "sequelize"
// local imports
import * as helper from "../../helper"
import { UserModel } from "./types"
export const UserFactory = (orm: Sequelize): UserModel => {
    return <UserModel>orm.define(
        "user_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            fullName: {
                type: DataTypes.STRING(200),
                allowNull: false,
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
            address: {
                type: DataTypes.STRING(500),
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
            pan_card: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            profileImage: {
                type: DataTypes.STRING(500),
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
