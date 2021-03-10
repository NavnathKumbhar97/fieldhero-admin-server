import { DataTypes, Sequelize } from "sequelize"
import { AgentModel } from "./types"
export const AgentFactory = (orm: Sequelize): AgentModel => {
    return <AgentModel>orm.define(
        "agent_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "user_master",
                    key: "id",
                },
            },
            prof_status: {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            gstin: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true,
            },
            company_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            note: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM,
                values: ["pending", "registered"],
                allowNull: false,
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
