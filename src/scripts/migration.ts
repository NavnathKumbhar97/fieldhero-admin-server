// ### Migration steps:
// 1. Deploy **server** build on your server using `caprover`
// 2. Deploy **client/portal** build on your server using `caprover`
// 3. Update database with `third_seed.ts` file using appropriate `DATABASE_URL` for `Prisma`
// 4. Modify data to support new structure using `migration.ts`

import { PrismaClient } from "@prisma/client"
import { performance } from "perf_hooks"
// local imports
import { AskConfirmation, getLanguages } from "./helper"

const prisma = new PrismaClient({
    log: ["query", "info", `warn`, `error`],
})

const main = async () => {
    const answer: boolean = await AskConfirmation()

    if (answer) {
        const start = performance.now()
        const reqs: Array<any> = []
        // aadhar update
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: { in: [5997, 3254, 3260, 3259, 1925, 5769, 2405] },
                },
                data: {
                    aadharNo: null,
                },
            })
        )
        // dl update
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: {
                        in: [5591, 3254],
                    },
                },
                data: {
                    dlNo: null,
                },
            })
        )
        // pan update
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: {
                        in: [1913, 1937],
                    },
                },
                data: {
                    panNo: null,
                },
            })
        )
        // email where blank
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    email1: "",
                },
                data: {
                    email1: null,
                },
            })
        )
        // email update
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: {
                        in: [3635, 3741, 208, 5094, 1941, 2104],
                    },
                },
                data: {
                    email1: null,
                },
            })
        )
        // contactNo2 where blank
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    contactNo2: "",
                },
                data: {
                    contactNo2: null,
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 3996,
                },
                data: {
                    contactNo2: "9638370601",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1928,
                },
                data: {
                    contactNo2: "9685287444",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4086,
                },
                data: {
                    contactNo2: "9726900004",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: {
                        in: [3732],
                    },
                },
                data: {
                    contactNo2: null,
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 2486,
                },
                data: {
                    contactNo1: "9879809883",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4165,
                },
                data: {
                    contactNo1: "8000969068",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 2403,
                },
                data: {
                    contactNo1: "9048633121",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 3580,
                },
                data: {
                    contactNo1: "8347279654",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4900,
                },
                data: {
                    contactNo1: "8460864182",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 891,
                },
                data: {
                    contactNo1: "8593971438",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4954,
                },
                data: {
                    contactNo1: "9825108587",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1164,
                },
                data: {
                    contactNo1: "9645954570",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 574,
                },
                data: {
                    permZip: "462001",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1157,
                },
                data: {
                    permZip: "670673",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "",
                    version: 2,
                },
                data: {
                    secondaryLanguage: null,
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "ORIYA",
                    version: 2,
                },
                data: {
                    secondaryLanguage: "ODIA",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1222,
                },
                data: {
                    secondaryLanguage: "ODIA",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "GUJARAT",
                    version: 2,
                },
                data: {
                    secondaryLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "HINDI,ENGLISH",
                    version: 2,
                },
                data: {
                    secondaryLanguage: "HINDI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "HINDI ENGLISH",
                    version: 2,
                },
                data: {
                    secondaryLanguage: "HINDI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1396,
                },
                data: {
                    secondaryLanguage: "HINDI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    secondaryLanguage: "MARATHI ENGLISH",
                    version: 2,
                },
                data: {
                    secondaryLanguage: "MARATHI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1202,
                },
                data: {
                    secondaryLanguage: "BENGALI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1406,
                },
                data: {
                    secondaryLanguage: "BENGALI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1539,
                },
                data: {
                    secondaryLanguage: "GUJARATI",
                    thirdLanguage: "SINDHI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1785,
                },
                data: {
                    secondaryLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    id: {
                        in: [2168, 3565],
                    },
                },
                data: {
                    secondaryLanguage: "GUJARATI",
                    thirdLanguage: "MARATHI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4019,
                },
                data: {
                    secondaryLanguage: "MARATHI",
                    thirdLanguage: "HINDI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4026,
                },
                data: {
                    secondaryLanguage: "ENGLISH",
                    thirdLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4083,
                },
                data: {
                    secondaryLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4112,
                },
                data: {
                    secondaryLanguage: "GUJARATI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 3187,
                },
                data: {
                    secondaryLanguage: null,
                    thirdLanguage: "NAGPOI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1335,
                },
                data: {
                    secondaryLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1375,
                },
                data: {
                    secondaryLanguage: "HINDI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 490,
                },
                data: {
                    primaryLanguage: "HINDI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    primaryLanguage: "KANNAD",
                    version: 2,
                },
                data: {
                    primaryLanguage: "KANNADA",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1186,
                },
                data: {
                    primaryLanguage: "ODIA",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1202,
                },
                data: {
                    primaryLanguage: "ASSAMESE",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    primaryLanguage: "MALYALAM",
                    version: 2,
                },
                data: {
                    primaryLanguage: "MALAYALAM",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1771,
                },
                data: {
                    primaryLanguage: "MALAYALAM",
                    secondaryLanguage: "TAMIL",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1771,
                },
                data: {
                    primaryLanguage: "MALAYALAM",
                    secondaryLanguage: "TAMIL",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 2111,
                },
                data: {
                    primaryLanguage: "HINDI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 3679,
                },
                data: {
                    primaryLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4138,
                },
                data: {
                    primaryLanguage: "HINDI",
                    secondaryLanguage: "GUJARATI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.updateMany({
                where: {
                    primaryLanguage: "GUJARTI",
                    version: 2,
                },
                data: {
                    primaryLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4531,
                },
                data: {
                    primaryLanguage: "GUJARATI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 4828,
                },
                data: {
                    primaryLanguage: "GUJARATI",
                    secondaryLanguage: "HINDI",
                    thirdLanguage: "ENGLISH",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 5099,
                },
                data: {
                    primaryLanguage: "GUJARATI",
                    secondaryLanguage: "MALAYALAM",
                    thirdLanguage: "HINDI",
                },
            })
        )
        reqs.push(
            prisma.candidateVersioning.update({
                where: {
                    id: 1157,
                },
                data: {
                    primaryLanguage: "MALAYALAM",
                },
            })
        )
        await prisma.$transaction(reqs)
        reqs.length = 0

        // * Step 2
        const version2 = await prisma.candidateVersioning.findMany({
            where: {
                version: 2,
            },
            include: {
                CandidateCallCentreHistory: true,
            },
        })

        version2.forEach((v2) => {
            const isApproved = v2.CandidateCallCentreHistory.find(
                (history) =>
                    history.isSubmitted === true &&
                    history.callStatus === "COMPLETED" &&
                    history.candidateConsent === "RECEIVED"
            )
            const isRejected = v2.CandidateCallCentreHistory.find(
                (history) =>
                    history.isSubmitted === true &&
                    history.candidateConsent === "DECLINED"
            )
            const lang1 = getLanguages().find((x) =>
                x === v2.primaryLanguage
                    ? v2.primaryLanguage.trim().toUpperCase()
                    : null
            )
            const lang2 = getLanguages().find((x) =>
                x === v2.secondaryLanguage
                    ? v2.secondaryLanguage.trim().toUpperCase()
                    : null
            )
            const v2Verification =
                v2.CandidateCallCentreHistory[
                    v2.CandidateCallCentreHistory.length - 1
                ]
            const reqPart1 = prisma.candidate.create({
                data: {
                    fullName: v2.fullName.toUpperCase(),
                    dob: v2.dob,
                    gender: v2.gender,
                    permAddress: v2.permAddress && v2.permAddress.toUpperCase(),
                    permCity: v2.permCity && v2.permCity.toUpperCase(),
                    permState: v2.permState && v2.permState.toUpperCase(),
                    permCountry: v2.permCountry && v2.permCountry.toUpperCase(),
                    permZip: v2.permZip,
                    currAddress: v2.currAddress && v2.currAddress.toUpperCase(),
                    currCity: v2.currCity && v2.currCity.toUpperCase(),
                    currState: v2.currState && v2.currState.toUpperCase(),
                    currCountry: v2.currCountry && v2.currCountry.toUpperCase(),
                    currZip: v2.currZip,
                    email1: v2.email1,
                    email2: v2.email2,
                    contactNo1: v2.contactNo1,
                    contactNo2: v2.contactNo2,
                    aadharNo: v2.aadharNo,
                    panNo: v2.panNo && v2.panNo.toUpperCase(),
                    dlNo: v2.dlNo && v2.dlNo.toUpperCase(),
                    createdOn: v2.createdOn,
                    createdBy: v2.createdBy,
                    modifiedOn: v2.modifiedOn,
                    modifiedBy: v2.modifiedBy,
                    expYears: v2.expYears,
                    preferLocation1:
                        v2.preferLocation1 && v2.preferLocation1.toUpperCase(),
                    preferLocation2:
                        v2.preferLocation2 && v2.preferLocation2.toUpperCase(),
                    skill1: v2.skill1 && v2.skill1.toUpperCase(),
                    skill2: v2.skill2 && v2.skill2.toUpperCase(),
                    primaryLanguage: lang1 as any,
                    secondaryLanguage: lang2 as any,
                    thirdLanguage:
                        v2.thirdLanguage && v2.thirdLanguage.toUpperCase(),
                    candidateRawid: v2.candidateRawId,
                    status: isApproved
                        ? "OTHER_UPDATE_PENDING"
                        : isRejected
                        ? "APPROVAL_PENDING"
                        : "VERIFICATION_IN_PROGRESS",
                    isActive: true,
                    CandidateIndustry: {
                        create: {
                            industryId: 1,
                            title: v2.industry && v2.industry.toUpperCase(),
                            createdBy: v2.createdBy,
                            createdOn: v2.createdOn,
                            modifiedBy: v2.modifiedBy,
                            modifiedOn: v2.modifiedOn,
                        },
                    },
                    CandidateCategory: {
                        create: {
                            categoryId: 1,
                            title: v2.category && v2.category.toUpperCase(),
                            createdBy: v2.createdBy,
                            createdOn: v2.createdOn,
                            modifiedBy: v2.modifiedBy,
                            modifiedOn: v2.modifiedOn,
                        },
                    },
                    CandidateWorkHistory: {
                        create: {
                            company: v2.lastCompany,
                            startDate: v2.startDate,
                            endDate: v2.endDate,
                            categoryId: 1,
                            categoryTitle:
                                v2.designation && v2.designation.toUpperCase(),
                            description: v2.jobDescription,
                            createdBy: v2.createdBy,
                            createdOn: v2.createdOn,
                            modifiedBy: v2.modifiedBy,
                            modifiedOn: v2.modifiedOn,
                        },
                    },
                    CandidateCallCentreHistory: {
                        createMany: {
                            data: v2.CandidateCallCentreHistory.map((item) => ({
                                callStatus: item.callStatus,
                                candidateConsent: item.candidateConsent,
                                comment: item.comment,
                                isSubmitted: item.isSubmitted,
                                createdBy: item.createdBy,
                                createdOn: item.createdOn,
                                modifiedBy: item.modifiedBy,
                                modifiedOn: item.modifiedOn,
                            })),
                        },
                    },
                    CandidateVerification: {
                        create: {
                            category: v2Verification.category,
                            contactNo1: v2Verification.contactNo1,
                            currCity: v2Verification.currCity,
                            currZip: v2Verification.currZip,
                            designation: v2Verification.designation,
                            dob: v2Verification.dob,
                            education: v2Verification.education,
                            email1: v2Verification.email1,
                            fullName: v2Verification.fullName,
                            expYears: v2Verification.expYears,
                            industry: v2Verification.industry,
                            lastCompany: v2Verification.lastCompany,
                            preferLocation1: v2Verification.preferLocation1,
                            preferLocation2: v2Verification.preferLocation2,
                            primaryLanguage: v2Verification.primaryLanguage,
                            secondaryLanguage: v2Verification.secondaryLanguage,
                            skill1: v2Verification.skill1,
                            skill2: v2Verification.skill2,
                            createdOn: v2.createdOn,
                            createdBy: v2.createdBy,
                            modifiedOn: v2.modifiedOn,
                            modifiedBy: v2.modifiedBy,
                        },
                    },
                },
            })

            reqs.push(reqPart1)
        })
        await prisma.$transaction(reqs)
        reqs.length = 0
        await prisma.candidateWorkHistory.deleteMany({
            where: {
                categoryId: 1,
                industryId: null,
                industryTitle: null,
                categoryTitle: null,
                company: null,
                startDate: null,
                endDate: null,
                description: null,
            },
        })
        await prisma.candidateWorkHistory.updateMany({
            where: {
                categoryId: 1,
                industryId: null,
                industryTitle: null,
                categoryTitle: null,
                company: null,
                startDate: null,
                endDate: null,
            },
            data: {
                categoryId: null,
            },
        })

        const rawIds = await prisma.candidateVersioning.groupBy({
            by: ["candidateRawId"],
            having: {
                candidateRawId: {
                    _count: {
                        equals: 1,
                    },
                },
            },
        })
        const version1 = await prisma.candidateVersioning.findMany({
            where: {
                candidateRawId: {
                    in: rawIds.map((raw) => raw.candidateRawId),
                },
                version: 1,
            },
        })
        await prisma.candidate.createMany({
            data: version1.map((v1) => ({
                fullName: v1.fullName,
                dob: v1.dob,
                contactNo1: v1.contactNo1,
                currCity: v1.currCity,
                currZip: v1.currZip,
                email1: v1.email1,
                skill1: v1.skill1,
                skill2: v1.skill2,
                preferLocation1: v1.preferLocation1,
                preferLocation2: v1.preferLocation2,
                expYears: v1.expYears,
                status: "SYSTEM_VERIFIED" as any,
                candidateRawid: v1.candidateRawId,
                createdBy: v1.createdBy,
                createdOn: v1.createdOn,
                modifiedBy: v1.modifiedBy,
                modifiedOn: v1.modifiedOn,
            })),
        })

        try {
            const response = await prisma.$transaction(reqs)
            console.log(response.length)
        } catch (error) {
            console.log(error)
            process.exit(0)
        }
        const end = performance.now()
        console.log(
            "Temp data done successful in: " + (end - start) / 1000 + "s"
        )
        process.exit(0)
    }
}
main()
