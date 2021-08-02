import { PrismaClient } from "@prisma/client"
import j2c from "json-2-csv"
import fs from "fs"
import os from "os"
import path from "path"

// local imports
import { AskConfirmation } from "./helper"

const prisma = new PrismaClient()

const main = async (fileName = "file") => {
    const answer: boolean = await AskConfirmation()

    if (answer) {
        const result = await prisma.candidateVersioning.findMany({
            select: { industry: true },
            distinct: "industry",
        })
        const csvString = await j2c.json2csvAsync(result)
        const writePath = path.join(
            os.homedir(),
            "Desktop",
            `Export_${fileName}_${new Date().getTime()}.csv`
        )
        fs.writeFileSync(writePath, csvString)
        console.log(writePath + " exported successfully")
    }
    process.exit(0)
}

main("industry")
