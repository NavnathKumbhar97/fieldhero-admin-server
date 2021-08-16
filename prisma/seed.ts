import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import generator from "generate-password"
// local imports
import config from "../src/config"

const prisma = new PrismaClient({
    log: ["info", "warn", "error", "query"],
})

async function main() {
    await prisma.permission.createMany({
        data: [
            {
                id: 1,
                name: "user_read_all",
                description: null,
                displayName: "Read all",
                group: "Admin - User",
                isActive: true,
            },
            {
                id: 2,
                name: "user_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Admin - User",
                isActive: true,
            },
            {
                id: 3,
                name: "user_create",
                description: null,
                displayName: "Create",
                group: "Admin - User",
                isActive: true,
            },
            {
                id: 4,
                name: "user_update",
                description: null,
                displayName: "Update",
                group: "Admin - User",
                isActive: true,
            },
            {
                id: 5,
                name: "user_self_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "User",
                isActive: true,
            },
            {
                id: 6,
                name: "user_reset_password",
                description: null,
                displayName: "Reset password",
                group: "Admin - User",
                isActive: true,
            },
            {
                id: 7,
                name: "user_self_update",
                description: null,
                displayName: "Update",
                group: "User",
                isActive: true,
            },
            {
                id: 8,
                name: "user_self_change_password",
                description: null,
                displayName: "Change password",
                group: "User",
                isActive: true,
            },
            {
                id: 9,
                name: "user_login",
                description: null,
                displayName: "User - Login",
                group: "Public",
                isActive: true,
            },
            {
                id: 10,
                name: "role_read_all",
                description: null,
                displayName: "Read all",
                group: "Role",
                isActive: true,
            },
            {
                id: 11,
                name: "role_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Role",
                isActive: true,
            },
            {
                id: 12,
                name: "role_create",
                description: null,
                displayName: "Create",
                group: "Role",
                isActive: true,
            },
            {
                id: 13,
                name: "role_update",
                description: null,
                displayName: "Update",
                group: "Role",
                isActive: true,
            },
            {
                id: 14,
                name: "permission_read_all",
                description: null,
                displayName: "Read all",
                group: "Permission",
                isActive: true,
            },
            {
                id: 15,
                name: "permission_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Permission",
                isActive: true,
            },
            {
                id: 16,
                name: "subscription_read_all",
                description: null,
                displayName: "Read all",
                group: "Subscription",
                isActive: true,
            },
            {
                id: 17,
                name: "subscription_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Subscription",
                isActive: true,
            },
            {
                id: 18,
                name: "subscription_create",
                description: null,
                displayName: "Create",
                group: "Subscription",
                isActive: true,
            },
            {
                id: 19,
                name: "subscription_update",
                description: null,
                displayName: "Update",
                group: "Subscription",
                isActive: true,
            },
            {
                id: 20,
                name: "industry_read_all",
                description: null,
                displayName: "Read all",
                group: "Industry",
                isActive: true,
            },
            {
                id: 21,
                name: "industry_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Industry",
                isActive: true,
            },
            {
                id: 22,
                name: "industry_create",
                description: null,
                displayName: "Create",
                group: "Industry",
                isActive: true,
            },
            {
                id: 23,
                name: "industry_update",
                description: null,
                displayName: "Update",
                group: "Industry",
                isActive: true,
            },
            {
                id: 24,
                name: "skill_read_all",
                description: null,
                displayName: "Read all",
                group: "Skill",
                isActive: true,
            },
            {
                id: 25,
                name: "skill_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Skill",
                isActive: true,
            },
            {
                id: 26,
                name: "skill_create",
                description: null,
                displayName: "Create",
                group: "Skill",
                isActive: true,
            },
            {
                id: 27,
                name: "skill_update",
                description: null,
                displayName: "Update",
                group: "Skill",
                isActive: true,
            },
            {
                id: 28,
                name: "company_read_all",
                description: null,
                displayName: "Read all",
                group: "Company",
                isActive: true,
            },
            {
                id: 29,
                name: "company_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Company",
                isActive: true,
            },
            {
                id: 30,
                name: "company_create",
                description: null,
                displayName: "Create",
                group: "Company",
                isActive: true,
            },
            {
                id: 31,
                name: "company_update",
                description: null,
                displayName: "Update",
                group: "Company",
                isActive: true,
            },
            {
                id: 32,
                name: "customer_read_all",
                description: null,
                displayName: "Read all",
                group: "Customer",
                isActive: true,
            },
            {
                id: 33,
                name: "customer_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Customer",
                isActive: true,
            },
            {
                id: 34,
                name: "customer_update",
                description: null,
                displayName: "Update",
                group: "Customer",
                isActive: true,
            },
            {
                id: 35,
                name: "customer_reset_password",
                description: null,
                displayName: "Reset password",
                group: "Customer",
                isActive: true,
            },
            {
                id: 36,
                name: "customer_subscription_read_all",
                description: null,
                displayName: "Read all",
                group: "Customer - Subscription",
                isActive: true,
            },
            {
                id: 37,
                name: "customer_subscription_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Customer - Subscription",
                isActive: true,
            },
            {
                id: 38,
                name: "customer_subscription_create",
                description: null,
                displayName: "Create",
                group: "Customer - Subscription",
                isActive: true,
            },
            {
                id: 39,
                name: "customer_subscription_update",
                description: null,
                displayName: "Update",
                group: "Customer - Subscription",
                isActive: true,
            },
            {
                id: 40,
                name: "candidate_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Candidate",
                isActive: true,
            },
            {
                id: 41,
                name: "candidate_create",
                description: null,
                displayName: "Create",
                group: "Candidate",
                isActive: true,
            },
            {
                id: 42,
                name: "candidate_update",
                description: null,
                displayName: "Update",
                group: "Candidate",
                isActive: true,
            },
            {
                id: 43,
                name: "candidate_work_history_read_all",
                description: null,
                displayName: "Read all",
                group: "Candidate - Work history",
                isActive: true,
            },
            {
                id: 44,
                name: "candidate_work_history_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Candidate - Work history",
                isActive: true,
            },
            {
                id: 45,
                name: "candidate_work_history_create",
                description: null,
                displayName: "Create",
                group: "Candidate - Work history",
                isActive: true,
            },
            {
                id: 46,
                name: "candidate_work_history_update",
                description: null,
                displayName: "Update",
                group: "Candidate - Work history",
                isActive: true,
            },
            {
                id: 47,
                name: "candidate_certification_read_all",
                description: null,
                displayName: "Read all",
                group: "Candidate - Certification",
                isActive: true,
            },
            {
                id: 48,
                name: "candidate_certification_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Candidate - Certification",
                isActive: true,
            },
            {
                id: 49,
                name: "candidate_certification_create",
                description: null,
                displayName: "Create",
                group: "Candidate - Certification",
                isActive: true,
            },
            {
                id: 50,
                name: "candidate_certification_update",
                description: null,
                displayName: "Update",
                group: "Candidate - Certification",
                isActive: true,
            },
            {
                id: 51,
                name: "candidate_read_all",
                description: null,
                displayName: "Read all",
                group: "Candidate - Basic",
                isActive: true,
            },
            {
                id: 52,
                name: "candidate_basic_bulk_create",
                description: null,
                displayName: "Bulk create",
                group: "Candidate - Basic",
                isActive: true,
            },
            {
                id: 53,
                name: "candidate_basic_upload_profile_image",
                description: null,
                displayName: "Upload profile image",
                group: "Candidate - Basic",
                isActive: true,
            },
            {
                id: 54,
                name: "agent_read_all",
                description: null,
                displayName: "Read all",
                group: "Admin - Agent",
                isActive: true,
            },
            {
                id: 55,
                name: "agent_read",
                description: "Fetch single record",
                displayName: "Read",
                group: "Admin - Agent",
                isActive: true,
            },
            {
                id: 56,
                name: "agent_create",
                description: null,
                displayName: "Create",
                group: "Admin - Agent",
                isActive: true,
            },
            {
                id: 57,
                name: "agent_update",
                description: null,
                displayName: "Update",
                group: "Admin - Agent",
                isActive: true,
            },
            {
                id: 58,
                name: "agent_self_read",
                description: null,
                displayName: "Read",
                group: "Agent",
                isActive: true,
            },
            {
                id: 59,
                name: "agent_self_update",
                description: null,
                displayName: "Update",
                group: "Agent",
                isActive: true,
            },
            {
                id: 60,
                name: "agent_self_change_password",
                description: null,
                displayName: "Change password",
                group: "Agent",
                isActive: true,
            },
            {
                id: 61,
                name: "candidate_upload_batch_self_read_all",
                description: null,
                displayName: "Read all",
                group: "Candidate Upload Batch",
                isActive: true,
            },
            {
                id: 62,
                name: "candidate_upload_batch_read_all",
                description: null,
                displayName: "Read all",
                group: "Admin - Candidate Upload Batch",
                isActive: true,
            },
            {
                id: 63,
                name: "admin_candidate_verification_read_all",
                displayName: "Read all",
                group: "Admin - Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 64,
                name: "admin_candidate_verification_read",
                displayName: "Read",
                group: "Admin - Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 65,
                name: "candidate_verification_read_all",
                displayName: "Read all",
                group: "Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 66,
                name: "candidate_verification_read",
                displayName: "Read",
                group: "Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 67,
                name: "candidate_verification_create",
                displayName: "Create",
                group: "Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 68,
                name: "candidate_verification_update",
                displayName: "Update",
                group: "Candidate Verification",
                description: null,
                isActive: true,
            },
            {
                id: 69,
                name: "category_read_all",
                description: null,
                displayName: "Read all",
                group: "Category",
                isActive: true,
            },
            {
                id: 70,
                name: "category_read",
                description: null,
                displayName: "Read",
                group: "Category",
                isActive: true,
            },
            {
                id: 71,
                name: "category_create",
                description: null,
                displayName: "Create",
                group: "Category",
                isActive: true,
            },
            {
                id: 72,
                name: "category_update",
                description: null,
                displayName: "Update",
                group: "Category",
                isActive: true,
            },
            {
                id: 73,
                name: "admin_candidate_upload_batch_change_pricing_template",
                description: null,
                displayName: "Change pricing template",
                group: "Admin - Candidate Upload Batch",
                isActive: true,
            },
            {
                id: 74,
                name: "admin_candidate_upload_batch_create",
                description: null,
                displayName: "Create",
                group: "Admin - Candidate Upload Batch",
                isActive: true,
            },
            {
                id: 75,
                name: "candidate_upload_batch_create",
                description: null,
                displayName: "Create",
                group: "Candidate Upload Batch",
                isActive: true,
            },
            {
                id: 76,
                name: "batch_priority_read_all",
                description: null,
                displayName: "Read all",
                group: "Batch Priority",
                isActive: true,
            },
            {
                id: 77,
                name: "batch_priority_read",
                description: null,
                displayName: "Read",
                group: "Batch Priority",
                isActive: true,
            },
            {
                id: 78,
                name: "batch_priority_create",
                description: null,
                displayName: "Create",
                group: "Batch Priority",
                isActive: true,
            },
            {
                id: 79,
                name: "agent_pricing_template_read_all",
                description: null,
                displayName: "Read all",
                group: "Agent Pricing Template",
                isActive: true,
            },
            {
                id: 80,
                name: "agent_pricing_template_read",
                description: null,
                displayName: "Read",
                group: "Agent Pricing Template",
                isActive: true,
            },
            {
                id: 81,
                name: "agent_pricing_template_create",
                description: null,
                displayName: "Create",
                group: "Agent Pricing Template",
                isActive: true,
            },
            {
                id: 82,
                name: "agent_pricing_template_set_active",
                description: null,
                displayName: "Set active",
                group: "Agent Pricing Template",
                isActive: true,
            },
            {
                id: 83,
                name: "admin_other_industry_category_read_all",
                description: null,
                displayName: "Read all",
                group: "Admin - Other Industry Category",
                isActive: true,
            },
            {
                id: 84,
                name: "admin_other_industry_category_update",
                description: null,
                displayName: "Update",
                group: "Agent Pricing Template",
                isActive: true,
            },
            {
                id: 85,
                name: "admin_candidate_upload_batch_approval",
                description: null,
                displayName: "Approval",
                group: "Admin - Candidate Upload Batch",
                isActive: true,
            },
        ],
    })

    await prisma.role.createMany({
        data: [
            {
                id: 1,
                name: "System Administrator",
                description: "Super user role generated by the system",
                isSystemGenerated: true,
                isActive: true,
            },
            {
                id: 2,
                name: "User",
                description: "Normal user role generated by the system",
                isSystemGenerated: true,
                isActive: true,
            },
            {
                id: 3,
                name: "Agent",
                description: "Agent role generated by the system",
                isSystemGenerated: true,
                isActive: true,
            },
            {
                id: 4,
                name: "Admin",
                isSystemGenerated: true,
                isActive: true,
            },
            {
                id: 5,
                name: "Call Centre Staff",
                description: "Call centre staff role generated by the system",
                isSystemGenerated: true,
                isActive: true,
            },
        ],
    })

    await prisma.user.create({
        data: {
            id: 1,
            fullName: config.SysAdm.name,
            isActive: true,
        },
    })

    const generatedPassword = generator.generate({
        length: 24,
        lowercase: true,
        uppercase: true,
        numbers: true,
        strict: true,
        symbols: false,
        excludeSimilarCharacters: true,
    })
    console.log(`Please keep password safe: ` + generatedPassword)

    await prisma.userLogin.create({
        data: {
            id: 1,
            userId: 1,
            roleId: 1,
            email: config.SysAdm.email,
            isSystemGenerated: true,
            passwordHash: bcrypt.hashSync(generatedPassword, 12),
        },
    })

    //
    const rolePerms = {
        1: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
            74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85,
        ], // System Administrator
        2: [9], // User
        3: [9, 52, 58, 59, 60, 61], // Agent
        4: [69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85], // Admin
        5: [5, 7, 8, 9, 65, 66, 67, 68], // Call Centre Staff
    }
    const inputRolePerms: Array<{ role: number; perm: number }> = []
    Object.entries(rolePerms).forEach((item) => {
        item[1].forEach((x) => {
            inputRolePerms.push({ role: parseInt(item[0]), perm: x })
        })
    })

    await prisma.rolePermission.createMany({
        data: inputRolePerms.map((rolePerm) => ({
            createdBy: 1,
            modifiedBy: 1,
            permissionId: rolePerm.perm,
            roleId: rolePerm.role,
        })),
    })

    await prisma.category.create({
        data: {
            id: 1,
            title: "OTHER",
            description: null,
            isActive: true,
            createdBy: 1,
            modifiedBy: 1,
        },
    })

    await prisma.industry.create({
        data: {
            id: 1,
            title: "OTHER",
            description: null,
            isActive: true,
            createdBy: 1,
            modifiedBy: 1,
        },
    })

    await prisma.emailTemplate.createMany({
        data: [
            {
                id: 1,
                templateId: "FHMSS_001",
                template: `<mjml>
                <mj-body>
                  <mj-section>
                    <mj-column border="black">
                      <mj-divider border-color="{style.borderColor}"></mj-divider>
                      <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
                    </mj-column>
                  </mj-section>
                  <mj-section>
                    <mj-column>
                      <mj-text font-size="20px">New Candidate Inquiry</mj-text>
                      <mj-text>Inquiry ID: <strong>{inquiryId}</strong>	</mj-text>
                      <mj-text>Name: <strong>{name}</strong></mj-text>
                      <mj-text>Contact no: <b>{contact}</b></mj-text>
                      <mj-text>Email: <b>{email}</b></mj-text>
                      <mj-text>Job Type: <b>{jobType}</b></mj-text>
                      <mj-text>Location: <b>{location}</b></mj-text>
                      <mj-text>Please check the portal for the more details.</mj-text>
                      <mj-text>Attachment won't be available on the portal.</mj-text>
                      <mj-divider border-color="{style.borderColor}"></mj-divider>
                    </mj-column>
                  </mj-section>
                </mj-body>
              </mjml>`,
                note:
                    "FHMSS - FieldHero Main Site Server\n" +
                    "Subject - [#CANINQ-{inquiryCreated.id}] New Candidate Inquiry Generated\n" +
                    "When new candidate inquiry created from FieldHero main site, send this email to admin.",
                createdBy: 1,
                modifiedBy: 1,
            },
            {
                id: 2,
                templateId: "FHMSS_002",
                template: `<mjml>
                <mj-body>
                  <mj-section>
                    <mj-column border="black">
                      <mj-divider border-color="{style.borderColor}"></mj-divider>
                      <mj-image href="https://fieldhero.in" target="_blank" src="cid:fh_logo_unique" height="100px" width="100px"></mj-image>
                    </mj-column>
                  </mj-section>
                  <mj-section>
                    <mj-column>
                      <mj-text font-size="20px">New Company Inquiry</mj-text>
                      <mj-text>Inquiry ID: <strong>{inquiryId}</strong>	</mj-text>
                      <mj-text>Name: <strong>{name}</strong></mj-text>
                      <mj-text>Designation: <b>{designation}</b></mj-text>
                      <mj-text>Company: <b>{company}</b></mj-text>
                      <mj-text>Contact no: <b>{contact}</b></mj-text>
                      <mj-text>Email: <b>{email}</b></mj-text>
                      <mj-text>Query: <b>{query}</b></mj-text>
                      <mj-text>Please check the portal for the more details.</mj-text>
                      <mj-divider border-color="{style.borderColor}"></mj-divider>
                    </mj-column>
                  </mj-section>
                </mj-body>
              </mjml>`,
                note:
                    "FHMSS - FieldHero Main Site Server\n" +
                    "Subject - [#COMINQ-{inquiryCreated.id}] New Company Inquiry Generated\n" +
                    "When new company inquiry created from FieldHero main site, send this email to admin.",
                createdBy: 1,
                modifiedBy: 1,
            },
        ],
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
