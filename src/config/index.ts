export const PORT: number = parseInt(process.env.PORT || "8080")
export const DB_HOST: string = process.env.DB_HOST || "localhost"
export const DB_PORT: number = parseInt(process.env.DB_PORT || "3006")
export const DB_NAME: string = process.env.DB_NAME || "dbname"
export const DB_USER: string = process.env.DB_USER || "username"
export const DB_PASS: string = process.env.DB_PASS || "password"
export const SERVER_URL: string = process.env.SERVER_URL || "http://localhost"
export const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost"
export const BCRYPT_ROUNDS: number = parseInt(process.env.BCRYPT_ROUNDS || "10")
// nodemailer
export const EMAIL_FROM: string =
    process.env.EMAIL_FROM || "user@email.com"
export const SMTP_HOST: string = process.env.SMTP_HOST || "localhost"
export const SMTP_EMAIL: string = process.env.SMTP_EMAIL || "user@email.com"
export const SMTP_PWD: string = process.env.SMTP_PWD || "password"
