import path from "path"
// local imports
import prisma from "../prisma"
import mailer from "../../nodemailer"
import config from "../config"
import { log } from "../helper"

const sendEmail = async (
    templateId: number,
    html: string,
    sendTo: string,
    subject: string
) => {
    try {
        await mailer.sendMail({
            to:
                config.NODE_ENV === "production"
                    ? [sendTo]
                    : ["chirag.shah@apexa.in"],
            from: config.EMAIL_FROM,
            subject,
            html,
            attachments: [
                {
                    filename: "logo.png",
                    path: path.join(__dirname, "../assets/image", "logo.png"),
                    cid: "fh_logo_unique",
                },
            ],
        })

        await prisma.emailLog.create({
            data: {
                emailTo: sendTo,
                templateId: templateId,
            },
        })
    } catch (error: any) {
        log.error(error.toString(), "Error in nodemailer while sendEmail")
    }
}

export default {
    sendEmail,
}
export { sendEmail }
