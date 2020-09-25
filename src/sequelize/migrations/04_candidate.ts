import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable("candidate_master", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: DataTypes.STRING(45),
                allowNull: false,
            },
            middleName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            birthDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_address: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            perm_city: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_state: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_country: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            perm_zip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_address: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            curr_city: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_state: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_country: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            curr_zip: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            email1: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            email2: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            contactNo1: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            contactNo2: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            aadharNo: {
                type: DataTypes.STRING(12),
                allowNull: true,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: true,
            },
        })
        await query.createTable("candidate_training_cert", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            issueDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            issuedBy: {
                type: DataTypes.STRING(80),
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_master",
                    key: "id",
                },
                allowNull: false,
            },
            skillId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "skill_set_master",
                    key: "id",
                },
                allowNull: false,
            },
        })
        await query.createTable("candidate_work_history", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_master",
                    key: "id",
                },
                allowNull: false,
            },
            companyId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "company_master",
                    key: "id",
                },
                allowNull: true,
            },
        })
        await query.createTable("skills_work_history", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            skillId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "skill_set_master",
                    key: "id",
                },
                allowNull: false,
            },
            workHistoryId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_work_history",
                    key: "id",
                },
                allowNull: false,
            },
        })
        await query.createTable("candidate_other_details", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            totalExpMonths: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            totalExpYears: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            registrationStatus: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "candidate_master",
                    key: "id",
                },
                allowNull: false,
            },
        })
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("candidate_master")
        await query.dropTable("candidate_training_cert")
        await query.dropTable("candidate_work_history")
        await query.dropTable("skills_work_history")
        await query.dropTable("candidate_other_details")
    },
}
