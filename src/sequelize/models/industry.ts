import { DataTypes, Sequelize } from "sequelize"
import { IndustryModel } from "./types"
export const IndustryFactory = (orm: Sequelize): IndustryModel => {
    return <IndustryModel>orm.define("industry_type_master", {
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
