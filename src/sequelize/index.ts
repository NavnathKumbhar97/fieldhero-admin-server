import { Sequelize } from "sequelize"
import * as models from "./models"
import * as config from "../config"

// sequelize instance for customer db
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

// Models for customer db
const Industry = models.IndustryFactory(orm)
const SkillSet = models.SkillSetFactory(orm)
const Company = models.CompanyFactory(orm)
const Candidate = models.CandidateFactory(orm)
const CandidateCertificate = models.CandidateCertificateFactory(orm)
const CandidateWorkHistory = models.CandidateWorkFactory(orm)
const CandidateWorkHistorySkill = models.CandidateWorkSkillFactory(orm)
const CandidateOtherDetails = models.CandidateOtherFactory(orm)

// Candidate, CandidateWorkHistory, CandidateCertificate
Candidate.hasMany(CandidateWorkHistory, { foreignKey: "candidateId" })
CandidateWorkHistory.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasMany(CandidateCertificate, { foreignKey: "candidateId" })
CandidateCertificate.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasOne(CandidateOtherDetails, {foreignKey: "candidateId"})
CandidateOtherDetails.belongsTo(Candidate, {foreignKey: "candidateId"})

//company
Industry.hasMany(Company, { foreignKey: "industryId" })
Company.belongsTo(Industry, { foreignKey: "industryId" })

//SkillSet CandidateWorkHistory 
SkillSet.hasMany(CandidateWorkHistorySkill,{ foreignKey: "skillId" })
CandidateWorkHistorySkill.belongsTo(SkillSet, { foreignKey: "skillId" })
CandidateWorkHistory.hasMany(CandidateWorkHistorySkill, { foreignKey: "workHistoryId" })
CandidateWorkHistorySkill.belongsTo(CandidateWorkHistory, { foreignKey: "workHistoryId" })

const customerDB = {
    Candidate,
    CandidateCertificate,
    CandidateOtherDetails,
    CandidateWorkHistory,
    CandidateWorkHistorySkill,
    Company,
    Industry,
    SkillSet,
}

export { customerDB, orm as ormCustomer }
