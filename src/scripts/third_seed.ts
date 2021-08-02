import { PrismaClient } from "@prisma/client"
// local import
import { AskConfirmation } from "./helper"

const prisma = new PrismaClient()

const main = async () => {
    const answer = await AskConfirmation()
    if (answer) {
        //
        await prisma.permission.createMany({
            data: [
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
        //
        const rolePerms = {
            1: [
                69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
                85,
            ], // System Administrator
            4: [
                69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
                85,
            ], // Admin
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
        //
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
        console.log("Third seed done successful")
    }
    process.exit(0)
}
main()
