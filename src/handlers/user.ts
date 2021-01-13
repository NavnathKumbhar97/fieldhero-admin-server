import { customerDB, ormCustomer } from "../sequelize"
import { log, passwordfunction } from "../helper"
import mjml from "mjml"
import mailer from "../../nodemailer"
import { emailTemplate } from "../handlers/mjml"
import { unuse } from "passport"

/**
 * Create User Details
 */
interface createUserParam {
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
    address: string
    state: string
    country: string
    profileImage: string
    isActive: boolean
    roleId: number
    email: string
}
const createUser = async (param: createUserParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const autoPassword = Math.random().toString(36).slice(-8)
        const userDetails = await customerDB.User.create(
            {
                fullName: param.fullName,
                birthDate: param.birthDate || "NULL",
                gender: param.gender,
                address: param.address,
                state: param.state,
                country: param.country,
                isActive: param.isActive,
            },
            { transaction }
        )

        const userLogin = await customerDB.UserLogin.create(
            {
                userId: userDetails.id,
                roleId: param.roleId,
                email: param.email,
                passwordHash: await passwordfunction.encryptPassword(
                    autoPassword
                ),
            },
            { transaction }
        )

        const html = mjml(
            emailTemplate.generatePassword(
                userDetails.fullName,
                userLogin.email,
                autoPassword
            ),
            { beautify: true }
        )
        // eslint-disable-next-line no-console
        console.log(html, "console")
        mailer
            .sendMail({
                to: [param.email],
                from: '"Field Hero" <no-reply@apexa.in>',
                subject: "Your Password",
                html: html.html,
            })
            .then((success) =>
                // eslint-disable-next-line no-console
                console.log({ success })
            )
            .catch((err) =>
                // eslint-disable-next-line no-console
                console.log({ err })
            )
        await transaction.commit()
        return Object.assign({ userDetails, userLogin })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while createUser")
        //console.log(err)
        throw err
    }
}

/**
 * Get All User Details
 * @param all
 */
const getUser = async (all: any) => {
    let whereCondition = {}
    if (all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    const users = await customerDB.User.findAll({
        attributes: [
            "id",
            "fullName",
            "birthDate",
            "gender",
            "address",
            "state",
            "country",
            "profileImage",
            "isActive",
        ],
        where: {
            isActive: whereCondition,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getUser")
        //console.log(err)
        throw err
    })
    return users
}

const getUserById = async (id: number) => {
    const user = await customerDB.User.findOne({
        attributes: [
            "id",
            "fullName",
            "birthDate",
            "gender",
            "address",
            "state",
            "country",
            "profileImage",
            "isActive",
        ],
        where: {
            id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getuserById")
        //console.log(err)
        throw err
    })
    return user
}

/*
 * Update Industry Details
 */
interface UpdateUserParam {
    id:number
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "transgender" | null
    address: string
    state: string
    country: string
    profileImage: string
    isActive: boolean
    roleId: number
    email: string
}
const updateUserById = async (param: UpdateUserParam) =>{
    const transaction = await ormCustomer.transaction()
    try{
        const user = await customerDB.User.findOne({
            where: { id: param.id },
        })
        let updateUserDetails =null
        if (user) {
            user.fullName= param.fullName,
            user.birthDate= param.birthDate || "NULL",
            user.gender= param.gender,
            user.address= param.address,
            user.address= param.address,
            user.state= param.state,
            user.country= param.country,
            user.isActive= param.isActive,
            updateUserDetails = await user.save()
        }
        {
            transaction
        }
        const userLoginDetails = await customerDB.UserLogin.findOne(
            {
                where: { userId: param.id },
            }
        )
        let updateUserLoginDetails = null
        if (userLoginDetails) {
            if(param.roleId)
            userLoginDetails.roleId = param.roleId
            if(param.email)
            userLoginDetails.email = param.email
            updateUserLoginDetails = await userLoginDetails.save()
        }
        {
            transaction
        }
        await transaction.commit()
        return Object.assign({ updateUserDetails, updateUserLoginDetails })
    } catch(err){
        await transaction.rollback()
        // console.log(err)
        log.error(err, "Error while updateUserById")
        throw err
    }
}

const User = {
    createUser,
    getUser,
    getUserById,
    updateUserById
}
export { User }
