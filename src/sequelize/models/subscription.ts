import { DataTypes, Sequelize } from "sequelize"
import { SubscriptionModel } from "./types"
import moment from "moment"
export const SubscriptionFactory = (orm: Sequelize): SubscriptionModel => {
    return <SubscriptionModel>orm.define(
        "subscription_master",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            planName: {
                type: DataTypes.STRING(40),
                allowNull: false,
                unique: true,
            },
            dataCount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            durationMonths: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            createdOn: {
                type: DataTypes.DATE,
                defaultValue: null,
                get() {
                    return moment(this.getDataValue("createdOn")).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )
                },
            },
            modifiedOn: {
                type: DataTypes.DATE,
                defaultValue: null,
                get() {
                    return moment(this.getDataValue("modifiedOn")).format(
                        "YYYY-MM-DD HH:mm:ss"
                    )
                },
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
            },
            note: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
        },
        {
            timestamps: true,
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
            deletedAt: false,
        }
    )
}
