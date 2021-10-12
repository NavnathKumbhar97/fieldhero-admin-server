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
        // const result = await prisma.candidate.findMany({
        //     select: {
        //         id: true,
        //         CandidateIndustry: {
        //             select: {
        //                 id: true,
        //                 IndustryId: {
        //                     select: { title: true },
        //                 },
        //             },
        //         },
        //         CandidateCategory: {
        //             select: {
        //                 id: true,
        //                 CategoryId: {
        //                     select: {
        //                         title: true,
        //                     },
        //                 },
        //             },
        //         },
        //     },
        //     where: {
        //         isActive: true,
        //         status: "APPROVAL_PENDING",
        //         OR: true
        //             ? [
        //                   {
        //                       fullName: {
        //                           contains: undefined,
        //                       },
        //                   },
        //                   {
        //                       id: undefined,
        //                   },
        //                   {
        //                       contactNo1: {
        //                           contains: undefined,
        //                       },
        //                   },
        //                   {
        //                       contactNo2: {
        //                           contains: undefined,
        //                       },
        //                   },
        //                   {
        //                       CandidateIndustry: {
        //                           some: {
        //                               industryId: {
        //                                   in: [5, 6, 4, 8, 9, 7, 2],
        //                               },
        //                           },
        //                       },
        //                   },
        //               ]
        //             : undefined,
        //     },
        //     orderBy: {
        //         fullName: "asc",
        //     },
        // })

        console.log("Temp data done successful")
        process.exit(0)
    }
}
main()
