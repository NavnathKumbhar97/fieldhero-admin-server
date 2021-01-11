import { DataTypes, Sequelize } from "sequelize"
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
            fullName: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            middleName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(45),
                allowNull: true,
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
            perm_address: {
                type: DataTypes.STRING(100),
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
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_address: {
                type: DataTypes.STRING(100),
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
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            email1: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            email2: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            contactNo1: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            contactNo2: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            aadharNo: {
                type: DataTypes.STRING(12),
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
