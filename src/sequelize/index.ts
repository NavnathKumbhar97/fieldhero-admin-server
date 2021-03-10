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
const Agent = models.AgentFactory(orm)
const CandidateJobPreference = models.CandiateJobPreferenceFactory(orm)

// Candidate, CandidateWorkHistory, CandidateCertificate, CandidateOtherDetails, CandidateJobPreference
Candidate.hasMany(CandidateWorkHistory, { foreignKey: "candidateId" })
CandidateWorkHistory.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasMany(CandidateCertificate, { foreignKey: "candidateId" })
CandidateCertificate.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasOne(CandidateOtherDetails, { foreignKey: "candidateId" })
CandidateOtherDetails.belongsTo(Candidate, { foreignKey: "candidateId" })
Candidate.hasOne(CandidateJobPreference, { foreignKey: "candidate_id" })
CandidateJobPreference.belongsTo(Candidate, { foreignKey: "candidate_id" })

// CandidateJobPreference - Industry
Industry.hasMany(CandidateJobPreference, { foreignKey: "industry_id" })
CandidateJobPreference.belongsTo(Industry, { foreignKey: "industry_id" })

//CandidateWorkHistory - Company
CandidateWorkHistory.belongsTo(Company, {
    foreignKey: "companyId",
})
Company.hasMany(CandidateWorkHistory, {
    foreignKey: "companyId",
})

//Company - Industry
Industry.hasMany(Company, { foreignKey: "industryId" })
Company.belongsTo(Industry, { foreignKey: "industryId" })

// Skill Set - Candidate Certificate
SkillSet.hasMany(CandidateCertificate, { foreignKey: "skillId" })
CandidateCertificate.belongsTo(SkillSet, { foreignKey: "skillId" })

// CandidateWorkHistory - Skill Set
SkillSet.hasMany(CandidateWorkHistorySkill, { foreignKey: "skillId" })
CandidateWorkHistorySkill.belongsTo(SkillSet, { foreignKey: "skillId" })
CandidateWorkHistory.hasMany(CandidateWorkHistorySkill, {
    foreignKey: "workHistoryId",
})
CandidateWorkHistorySkill.belongsTo(CandidateWorkHistory, {
    foreignKey: "workHistoryId",
})

// Customer - Customer Login
Customer.hasOne(CustomerLogin, { foreignKey: "customerId" })
CustomerLogin.belongsTo(Customer, { foreignKey: "customerId" })

// Role - Permission
Permission.hasMany(RolePermission, { foreignKey: "permissionId" })
Role.hasMany(RolePermission, { foreignKey: "roleId" })
RolePermission.belongsTo(Permission, { foreignKey: "permissionId" })
RolePermission.belongsTo(Role, { foreignKey: "roleId" })

// User - User Login
User.hasOne(UserLogin, { foreignKey: "userId" })
UserLogin.belongsTo(User, { foreignKey: "userId" })

// Role - User Login
Role.hasMany(UserLogin, { foreignKey: "roleId" })
UserLogin.belongsTo(Role, { foreignKey: "roleId" })

const customerDB = {
    Agent,
    Candidate,
    CandidateCertificate,
    CandidateJobPreference,
    CandidateOtherDetails,
    CandidateWorkHistory,
    CandidateWorkHistorySkill,
    Company,
    Customer,
    CustomerLogin,
    CustomerSubscription,
    CustomerToken,
    Industry,
    Permission,
    Role,
    RolePermission,
    SkillSet,
    Subscription,
    User,
    UserLogin,
}

export { customerDB, orm as ormCustomer }
