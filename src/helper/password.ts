import bcrypt from "bcrypt"
const BCRYPT_SALT_ROUNDS: string = process.env.BCRYPT_ROUNDS!

const encryptPassword = async (password: any) => {
    const encPassword = await bcrypt.hash(
        password,
        parseInt(BCRYPT_SALT_ROUNDS)
    )
    return encPassword
}

const verifyPassword = async (password: any, encPassword: any) => {
    const isVerified = await bcrypt.compare(password, encPassword)
    return isVerified
}

const passwordfunction = {
    encryptPassword,
    verifyPassword,
}

export { passwordfunction }
