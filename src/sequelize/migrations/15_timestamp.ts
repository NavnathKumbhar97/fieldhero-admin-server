import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.addColumn({ tableName: "candidate_master" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "candidate_master" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn(
            { tableName: "candidate_other_details" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "candidate_other_details" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn({ tableName: "skill_set_master" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "skill_set_master" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn(
            { tableName: "skills_work_history" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "skills_work_history" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "candidate_training_cert" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "candidate_training_cert" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "candidate_work_history" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "candidate_work_history" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "industry_type_master" },
            "createdOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn(
            { tableName: "industry_type_master" },
            "modifiedOn",
            {
                type: DataTypes.DATE,
            }
        )
        await query.addColumn({ tableName: "company_master" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "company_master" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_master" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_master" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_login" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_login" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_token" }, "createdOn", {
            type: DataTypes.DATE,
        })
        await query.addColumn({ tableName: "customer_token" }, "modifiedOn", {
            type: DataTypes.DATE,
        })
        await query.removeColumn({ tableName: "customer_token" }, "createdAt")
        await query.changeColumn({ tableName: "candidate_master" }, "gender", {
            type: DataTypes.ENUM,
            values: ["male", "female", "transgender"],
            allowNull: true,
        })
    },
    down: async (query: QueryInterface) => {
        await query.removeColumn({ tableName: "candidate_master" }, "createdOn")
        await query.removeColumn(
            { tableName: "candidate_master" },
            "modifiedOn"
        )
        await query.removeColumn(
            { tableName: "candidate_other_details" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "candidate_other_details" },
            "modifiedOn"
        )
        await query.removeColumn({ tableName: "skill_set_master" }, "createdOn")
        await query.removeColumn(
            { tableName: "skill_set_master" },
            "modifiedOn"
        )
        await query.removeColumn(
            { tableName: "skills_work_history" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "skills_work_history" },
            "modifiedOn"
        )
        await query.removeColumn(
            { tableName: "candidate_training_cert" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "candidate_training_cert" },
            "modifiedOn"
        )
        await query.removeColumn(
            { tableName: "candidate_work_history" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "candidate_work_history" },
            "modifiedOn"
        )
        await query.removeColumn(
            { tableName: "industry_type_master" },
            "createdOn"
        )
        await query.removeColumn(
            { tableName: "industry_type_master" },
            "modifiedOn"
        )
        await query.removeColumn({ tableName: "company_master" }, "createdOn")
        await query.removeColumn({ tableName: "company_master" }, "modifiedOn")
        await query.removeColumn({ tableName: "customer_master" }, "createdOn")
        await query.removeColumn({ tableName: "customer_master" }, "modifiedOn")
        await query.removeColumn({ tableName: "customer_login" }, "createdOn")
        await query.removeColumn({ tableName: "customer_login" }, "modifiedOn")
        await query.removeColumn({ tableName: "customer_token" }, "createdOn")
        await query.removeColumn({ tableName: "customer_token" }, "modifiedOn")
        await query.addColumn({ tableName: "customer_token" }, "createdAt", {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        })
        await query.changeColumn({ tableName: "candidate_master" }, "gender", {
            type: DataTypes.STRING(45),
            allowNull: true,
        })
    },
}
