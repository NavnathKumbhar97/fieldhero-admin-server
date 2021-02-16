import nodemailer from "nodemailer"
// local imports
import * as config from "./src/config"

const transaporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    secure: true,
    auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PWD,
    },
})

export default transaporter
