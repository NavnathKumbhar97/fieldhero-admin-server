import { DataTypes, Sequelize } from "sequelize"
import { CandidateWorkSkillModel } from "./types"
export const CandidateWorkSkillFactory = (
    orm: Sequelize
): CandidateWorkSkillModel => {
    return <CandidateWorkSkillModel>orm.define(
        "skills_work_history",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            skillId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "skill_set_master",
                    key: "id",
                },
                allowNull: false,
            },
            workHistoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_work_history",
                    key: "id",
                },
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
