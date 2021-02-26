import { DataTypes, Sequelize } from "sequelize"
// local imports
import * as helper from "../../helper"
import { CandidateModel } from "./types"
export const CandidateFactory = (orm: Sequelize): CandidateModel => {
    return <CandidateModel>orm.define(
        "candidate_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            perm_address: {
                type: DataTypes.STRING(500),
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
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            curr_address: {
                type: DataTypes.STRING(500),
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
                type: DataTypes.STRING(10),
                allowNull: true,
            },
            email1: {
                type: DataTypes.STRING(80),
                allowNull: true,
                unique: true,
            },
            email2: {
                type: DataTypes.STRING(80),
                allowNull: true,
            },
            contactNo1: {
                type: DataTypes.STRING(45),
                allowNull: false,
                unique: true,
            },
            contactNo2: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            aadharNo: {
                type: DataTypes.STRING(15),
                allowNull: true,
                unique: true,
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
            approved_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            approved_by: {
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
