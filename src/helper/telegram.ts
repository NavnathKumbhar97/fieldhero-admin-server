import axios from "axios"
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from "../config"
import log from "./log"

const url = (): string => {
    return `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`
}

const formatMessage = (msg: string): string => {
    return msg
        .split("-")
        .join("\\-")
        .split(".")
        .join("\\.")
        .split("(")
        .join("\\(")
        .split(")")
        .join("\\)")
}

const sendMessage = async (message: string): Promise<void> => {
    try {
        if (TELEGRAM_CHAT_ID) {
            const response = await axios.post(`${url()}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text:
                    "*Message from Fieldhero Admin*\n" + formatMessage(message),
                parse_mode: "MarkdownV2",
            })
        } else {
            log.error("Telegram chat id is missing. Message not sent.")
        }
    } catch (error) {
        log.error(error.message, "Error while sendMessage in telegram")
    }
}

export { sendMessage }
export default { sendMessage }
