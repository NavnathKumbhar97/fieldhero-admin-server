import { prompt } from "enquirer"
import chalk from "chalk"
// local imports
import { DATABASE_URL } from "../config"

const ctx = new chalk.Instance({ level: 3 })
const AskConfirmation = async (): Promise<boolean> => {
    console.log(`Current Database URL: ${ctx.black.bgGreen(DATABASE_URL)}`)

    const answer: { confirmation: boolean } = await prompt([
        {
            type: "confirm",
            name: "confirmation",
            message: "Are you sure you want to continue?",
        },
    ])
    return answer.confirmation
}

const languages = {
    ASSAMESE: "ASSAMESE",
    BENGALI: "BENGALI",
    BHOJPURI: "BHOJPURI",
    ENGLISH: "ENGLISH",
    GUJARATI: "GUJARATI",
    HINDI: "HINDI",
    KANNADA: "KANNADA",
    MAITHILI: "MAITHILI",
    MALAYALAM: "MALAYALAM",
    MARATHI: "MARATHI",
    ODIA: "ODIA",
    PUNJABI: "PUNJABI",
    SANSKRIT: "SANSKRIT",
    SANTALI: "SANTALI",
    TAMIL: "TAMIL",
    TELUGU: "TELUGU",
    URDU: "URDU",
}

const getLanguages = (): Array<string> => {
    return Object.values(languages)
}

export { AskConfirmation, getLanguages }
