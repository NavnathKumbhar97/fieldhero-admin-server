import { DataTypes, Sequelize } from "sequelize"
import { CandidateOtherModel } from "./types"
export const CandidateOtherFactory = (orm: Sequelize): CandidateOtherModel => {
    return <CandidateOtherModel>orm.define(
        "candidate_other_details",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            totalExpMonths: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            totalExpYears: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            registrationStatus: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_master",
                    key: "id",
                },
                allowNull: false,
            },
            profileImage: {
                type: DataTypes.STRING(500),
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
