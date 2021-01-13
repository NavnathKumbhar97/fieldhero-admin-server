import nodemailer from "nodemailer"

const transaporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PWD,
    },
})

export default transaporter
