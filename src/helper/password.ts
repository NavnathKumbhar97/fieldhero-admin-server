import bcrypt from "bcrypt"
// local imports
import * as config from "../config"

const encryptPassword = async (password: string): Promise<string> => {
    const encPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS)
    return encPassword
}

const verifyPassword = async (
    password: string,
    encPassword: string
): Promise<boolean> => {
    const isVerified = await bcrypt.compare(password, encPassword)
    return isVerified
}

const passwordfunction = {
    encryptPassword,
    verifyPassword,
}

export { passwordfunction }
