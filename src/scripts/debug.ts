import { PrismaClient } from "@prisma/client"
// local imports
import { AskConfirmation } from "./helper"

const prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
    ],
})
prisma.$on("query", (e) => {
    console.log(e.query)
})

const main = async () => {
    // const answer: boolean = await AskConfirmation()
    const answer = true
    if (answer) {
        const result = await prisma.candidateVerification.findMany({
            where: {
                CandidateId: {
                    CandidateRawId: {
                        batchId: 42,
                    },
                    status: "VERIFICATION_IN_PROGRESS",
                },
            },
            select: {
                candidateId: true,
                CreatedBy: {
                    select: {
                        User: {
                            select: {
                                fullName: true,
                            },
                        },
                    },
                },
            },
        })
        const result2 = await prisma.permission.findMany({})

        console.log("Temp data done successful")
        process.exit(0)
    }
}
main()
