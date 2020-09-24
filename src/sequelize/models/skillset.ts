import { DataTypes, Sequelize } from "sequelize"
import { SkillSetModel } from "./types"
export const SkillSetFactory = (orm: Sequelize): SkillSetModel => {
    return <SkillSetModel>orm.define("skill_set_master", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(45),
            unique: true,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true,
        },
    })
}
