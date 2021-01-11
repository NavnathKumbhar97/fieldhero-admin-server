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
const Customer = models.CustomerFactory(orm)
const CustomerLogin = models.CustomerLoginFactory(orm)
const CustomerSubscription = models.CustomerSubscriptionFactory(orm)
const CustomerToken = models.CustomerTokenFactory(orm)
const Subscription = models.SubscriptionFactory(orm)
const User = models.UserFactory(orm)
const Role = models.RoleFactory(orm)
const UserLogin = models.UserLoginFactory(orm)
const Permission = models.PermissionFactory(orm)
const RolePermission = models.RolePermissionFactory(orm)

// Candidate, CandidateWorkHistory, CandidateCertificate
Candidate.hasMany(CandidateWorkHistory, { foreignKey: "candidateId" })
CandidateWorkHistory.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasMany(CandidateCertificate, { foreignKey: "candidateId" })
CandidateCertificate.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasOne(CandidateOtherDetails, { foreignKey: "candidateId" })
CandidateOtherDetails.belongsTo(Candidate, { foreignKey: "candidateId" })

//CandidateWorkHistory
CandidateWorkHistory.belongsTo(Company, {
    foreignKey: "companyId",
})
Company.hasMany(CandidateWorkHistory, {
    foreignKey: "companyId",
})

//company
Industry.hasMany(Company, { foreignKey: "industryId" })
Company.belongsTo(Industry, { foreignKey: "industryId" })

// Skill Set
SkillSet.hasMany(CandidateCertificate, { foreignKey: "skillId" })
CandidateCertificate.belongsTo(SkillSet, { foreignKey: "skillId" })

// CandidateWorkHistory
SkillSet.hasMany(CandidateWorkHistorySkill, { foreignKey: "skillId" })
CandidateWorkHistorySkill.belongsTo(SkillSet, { foreignKey: "skillId" })
CandidateWorkHistory.hasMany(CandidateWorkHistorySkill, {
    foreignKey: "workHistoryId",
})
CandidateWorkHistorySkill.belongsTo(CandidateWorkHistory, {
    foreignKey: "workHistoryId",
})

// Customer
Customer.hasOne(CustomerLogin, { foreignKey: "customerId" })
CustomerLogin.belongsTo(Customer, { foreignKey: "customerId" })

const customerDB = {
    Candidate,
    CandidateCertificate,
    CandidateOtherDetails,
    CandidateWorkHistory,
    CandidateWorkHistorySkill,
    Company,
    Customer,
    CustomerLogin,
    CustomerSubscription,
    CustomerToken,
    Industry,
    SkillSet,
    Subscription,
    User,
    Role,
    UserLogin,
    Permission,
    RolePermission,
}

export { customerDB, orm as ormCustomer }
