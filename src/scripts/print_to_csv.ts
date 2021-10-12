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
        const result = await prisma.candidate.findMany({
            where: {
                CandidateIndustry: {
                    some: {
                        title: "FMCG",
                    },
                },
            },

            select: {
                passwordHash: false,
                id: true,
                fullName: true,
                contactNo1: true,
                contactNo2: true,
                email1: true,
                email2: true,
                currCity: true,
                currAddress: true,
                currState: true,
                currZip: true,
                permCity: true,
                permAddress: true,
                permState: true,
                permZip: true,
                skill1: true,
                skill2: true,
                preferLocation1: true,
                preferLocation2: true,
                expYears: true,
                aadharNo: true,
                panNo: true,
                dlNo: true,
                primaryLanguage: true,
                secondaryLanguage: true,
                thirdLanguage: true,
                status: true,
                dob: true,
                gender: true,
                education: true,
                CandidateCategory: {
                    select: {
                        title: true,
                    },
                },
                CandidateIndustry: {
                    select: {
                        title: true,
                    },
                },
            },
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

main("candidates")
