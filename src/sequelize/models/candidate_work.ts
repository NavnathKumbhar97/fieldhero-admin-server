import { DataTypes, Sequelize } from "sequelize"
import { CandidateWorkModel } from "./types"
export const CandidateWorkFactory = (orm: Sequelize): CandidateWorkModel => {
    return <CandidateWorkModel>orm.define("candidate_work_history", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING(100),
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
        companyId: {
            type: DataTypes.INTEGER,
            references: {
                model: "company_master",
                key: "id",
            },
            allowNull: true,
        },
    })
}
