import { DataTypes, Sequelize } from "sequelize"
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
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: DataTypes.ENUM,
                values: ["male", "female", "transgender"],
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING(100),
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
