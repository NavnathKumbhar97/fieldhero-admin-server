import { DataTypes, Sequelize } from "sequelize"
import * as models from "./models"
import * as config from "../config"
const orm = new Sequelize({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USER,
    password: config.DB_PASS,
    dialect: "mariadb",
    dialectOptions: {
        connectionTimeout: 1000,
    },
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false,
    },
})

const Industry = models.IndustryFactory(orm)
const SkillSet = models.SkillSetFactory(orm)
const Company = models.CompanyFactory(orm)

export { orm, Industry, SkillSet, Company }
