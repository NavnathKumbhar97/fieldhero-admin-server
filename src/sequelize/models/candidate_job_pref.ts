import { DataTypes, Sequelize } from "sequelize"
import { CandidateJobPreferenceModel } from "./types"
export const CandiateJobPreferenceFactory = (
    orm: Sequelize
): CandidateJobPreferenceModel => {
    return <CandidateJobPreferenceModel>orm.define(
        "candidate_job_preference",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            candidate_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "candidate_master",
                    key: "id",
                },
            },
            industry_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "industry_type_master",
                    key: "id",
                },
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            pref_location_1: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            pref_location_2: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            pref_location_3: {
                type: DataTypes.STRING(50),
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
