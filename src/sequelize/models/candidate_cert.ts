import { DataTypes, Sequelize } from "sequelize"
import { CandidateCertificateModel } from "./types"
export const CandidateCertificateFactory = (
    orm: Sequelize
): CandidateCertificateModel => {
    return <CandidateCertificateModel>orm.define(
        "candidate_training_cert",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.ENUM,
                values: ["training", "certificate", "other"],
                defaultValue: "other",
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            issueDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            issuedBy: {
                type: DataTypes.STRING(80),
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(200),
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
            skillId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "skill_set_master",
                    key: "id",
                },
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
