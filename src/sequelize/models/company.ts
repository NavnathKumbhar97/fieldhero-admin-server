import { DataTypes, Sequelize } from "sequelize"
import { CompanyModel } from "./types"
export const CompanyFactory = (orm: Sequelize): CompanyModel => {
    return <CompanyModel>orm.define("company_master", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        companyName: {
            type: DataTypes.STRING(45),
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
        industryId: {
            type: DataTypes.INTEGER,
            references: {
                model: "industry_type_master",
                key: "id",
            },
            allowNull: true,
        },
    })
}
