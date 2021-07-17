export const PORT: number = parseInt(process.env.PORT || "8080")
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost"
export const AGENT_PORTAL_URL: string =
    process.env.AGENT_PORTAL_URL || "http://localhost"
// JWT
export const BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS || "10")
export const JWT_SECRET: string = process.env.JWT_SECRET_KEY || "jwt_secret"
// nodemailer
export const EMAIL_FROM: string = process.env.EMAIL_FROM || "user@email.com"
export const SMTP_HOST: string = process.env.SMTP_HOST || "localhost"
export const SMTP_EMAIL: string = process.env.SMTP_EMAIL || "user@email.com"
export const SMTP_PWD: string = process.env.SMTP_PWD || "password"
// telegram
export const TELEGRAM_BOT_TOKEN: string = process.env.TELEGRAM_BOT_TOKEN || ""
export const TELEGRAM_CHAT_ID: string | undefined =
    process.env.TELEGRAM_CHAT_ID || undefined

// for prisma seed.ts
export const SysAdm = {
    name: process.env.SYSADM_NAME || "User",
    email: process.env.SYSADM_EMAIL || "user@email.com",
    contactNo: process.env.SYSADM_CONTACT || "9876543210",
}

export default {
    PORT,
    CLIENT_URL,
    AGENT_PORTAL_URL,
    BCRYPT_ROUNDS,
    EMAIL_FROM,
    SMTP_HOST,
    SMTP_EMAIL,
    SMTP_PWD,
    JWT_SECRET,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
    SysAdm,
}
