import { QueryInterface, DataTypes } from "sequelize"
module.exports = {
    up: async (query: QueryInterface) => {
        await query.createTable(
            {
                tableName: "user_master",
            },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                fullName: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                birthDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: true,
                },
                gender: {
                    type: DataTypes.ENUM,
                    values: ["male", "female", "transgender"],
                    allowNull: true,
                },
                address: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                state: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                country: {
                    type: DataTypes.STRING(30),
                    allowNull: true,
                },
                profileImage: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
        await query.createTable(
            {
                tableName: "role_master",
            },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
        await query.createTable(
            {
                tableName: "user_login",
            },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: "user_master",
                        key: "id",
                    },
                    allowNull: false,
                },
                roleId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: "role_master",
                        key: "id",
                    },
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(80),
                    allowNull: false,
                },
                passwordHash: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
        await query.createTable(
            {
                tableName: "permission_master",
            },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                },
                displayName: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                group: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                isActive: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
        await query.createTable(
            {
                tableName: "role_permission",
            },
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                roleId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: "role_master",
                        key: "id",
                    },
                    allowNull: false,
                },
                permissionId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: "permission_master",
                        key: "id",
                    },
                    allowNull: false,
                },
                createdOn: {
                    type: DataTypes.DATE,
                },
                modifiedOn: {
                    type: DataTypes.DATE,
                },
            }
        )
    },
    down: async (query: QueryInterface) => {
        await query.dropTable("role_permission")
        await query.dropTable("permission_master")
        await query.dropTable("user_login")
        await query.dropTable("role_master")
        await query.dropTable("user_master")
    },
}
