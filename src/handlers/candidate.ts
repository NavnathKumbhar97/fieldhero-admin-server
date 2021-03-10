import paginate from "jw-paginate"
import * as helper from "../helper"
import { customerDB, ormCustomer } from "../sequelize"
import { log, httpStatus } from "../helper"
import { Op } from "sequelize"
import { IRejected } from "../helper/candidate"

/*
 * get All Get Candidates
 */

const getCandidates = async (pagination: any) => {
    let whereCondition = {}
    if (pagination.all == "*") {
        whereCondition = [0, 1]
    } else {
        whereCondition = 1
    }
    let page = 1,
        limit = 10
    if (pagination.page) page = parseInt(pagination.page)
    if (pagination.limit) limit = parseInt(pagination.limit)
    const count = await customerDB.Candidate.count()
    const _paginate = paginate(count, page, limit)
    const candidates = await customerDB.Candidate.findAndCountAll({
        limit: limit,
        offset: _paginate.startIndex >= 0 ? _paginate.startIndex : 0,
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            {
                model: customerDB.CandidateWorkHistory,
                include: [
                    {
                        model: customerDB.Company,
                        required: false,
                    },
                ],
            },
        ],
        where: {
            isActive: whereCondition,
        },
        order: [["fullName", "ASC"]],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidates")
        throw err
    })
    const response = {
        Candidates: candidates.rows,
        ..._paginate,
    }

    return response
}

/*
 * get All Get Candidates By Id
 */

const getCandidateById = async (id: number) => {
    const candidate = await customerDB.Candidate.findOne({
        where: {
            id,
        },
        include: [
            { model: customerDB.CandidateOtherDetails },
            { model: customerDB.CandidateCertificate },
            {
                model: customerDB.CandidateWorkHistory,
                include: [{ model: customerDB.Company }],
            },
        ],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateById")
        throw err
    })
    return candidate
}

/*
 * Delete All Candidate truncate
 */
const deleteAllCandiate = async () => {
    const transaction = await ormCustomer.transaction()
    try {
        await ormCustomer.query("SET FOREIGN_KEY_CHECKS = 0", {
            raw: true,
            transaction,
        })
        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.truncate(
            {
                transaction,
            }
        )
        const deleteCandiateCertificate = await customerDB.CandidateCertificate.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.truncate(
            {
                transaction,
            }
        )

        const deleteCandiateInfo = await customerDB.Candidate.truncate({
            transaction,
        })
        await ormCustomer.query("SET FOREIGN_KEY_CHECKS = 1", {
            raw: true,
            transaction,
        }) //<---- Do not check referential constraints

        await transaction.commit()
        return Object.assign({
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            deleteCandiateOtherDetails,
            deleteCandiateCertificate,
            deleteCandiateInfo,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while deleteCandiate")

        throw err
    }
}

/*
 * Delete All Candidate By Id
 */
const deleteCandiateById = async (id: number) => {
    const transaction = await ormCustomer.transaction()
    try {
        const getCandiateDetails = await customerDB.Candidate.findOne({
            where: {
                id: id,
            },
            transaction,
        })
        const candidateId = getCandiateDetails?.id
        const getCandidatesWorkHistory = await customerDB.CandidateWorkHistory.findAll(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const getCandidatesWorkHistoryArray = getCandidatesWorkHistory.map(
            (item) => {
                return item.id!
            }
        )
        const deleteSkillsWorkHistory = await customerDB.CandidateWorkHistorySkill.destroy(
            {
                where: {
                    workHistoryId: getCandidatesWorkHistoryArray,
                },
                transaction,
            }
        )
        const deleteCandiateWorkHistroy = await customerDB.CandidateWorkHistory.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateOtherDetails = await customerDB.CandidateOtherDetails.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateCertificate = await customerDB.CandidateCertificate.destroy(
            {
                where: {
                    candidateId: candidateId,
                },
                transaction,
            }
        )
        const deleteCandiateInfo = await customerDB.Candidate.destroy({
            where: {
                id: id,
            },
            transaction,
        })
        await transaction.commit()
        return Object.assign({
            deleteSkillsWorkHistory,
            deleteCandiateWorkHistroy,
            deleteCandiateOtherDetails,
            deleteCandiateCertificate,
            deleteCandiateInfo,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while deleteCandiateById")
        throw err
    }
}
/*
 * Create Candidate
 */
interface createCandidateParam {
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "other" | null
    perm_address: string
    perm_city: string
    perm_state: string
    perm_country: string
    perm_zip: string
    curr_address: string
    curr_city: string
    curr_state: string
    curr_country: string
    curr_zip: string
    email1: string
    email2: string
    contactNo1: string
    contactNo2: string
    aadharNo: string
    isActive: boolean
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId: number
}

const createCandidate = async (param: createCandidateParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidate = await customerDB.Candidate.create(
            {
                fullName: param.fullName,
                birthDate: param.birthDate,
                gender: param.gender,
                perm_address: param.perm_address,
                perm_city: param.perm_city,
                perm_state: param.perm_state,
                perm_country: param.perm_country,
                perm_zip: param.perm_zip,
                curr_address: param.curr_address,
                curr_city: param.curr_city,
                curr_state: param.curr_state,
                curr_country: param.curr_country,
                curr_zip: param.curr_zip,
                email1: param.email1,
                email2: param.email2,
                contactNo1: param.contactNo1,
                contactNo2: param.contactNo2,
                aadharNo: param.aadharNo,
                isActive: param.isActive,
            },
            { transaction }
        )

        const candidateother = await customerDB.CandidateOtherDetails.create(
            {
                totalExpMonths: param.totalExpMonths,
                totalExpYears: param.totalExpYears,
                registrationStatus: param.registrationStatus,
                candidateId: candidate.get("id") as number,
            },
            { transaction }
        )

        await transaction.commit()
        return Object.assign({ candidate, candidateother })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while createCandidate")
        throw err
    }
}
/*
 * Update Candidate
 */
interface updateCandidateParam {
    id: number
    fullName: string
    birthDate: Date
    gender: "male" | "female" | "other" | null
    perm_address: string
    perm_city: string
    perm_state: string
    perm_country: string
    perm_zip: string
    curr_address: string
    curr_city: string
    curr_state: string
    curr_country: string
    curr_zip: string
    email1: string
    email2: string
    contactNo1: string
    contactNo2: string
    aadharNo: string
    isActive: boolean
    totalExpMonths: number
    totalExpYears: number
    registrationStatus: string
    candidateId: number
}

const updateCandidateById = async (param: updateCandidateParam) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidateInfo = await customerDB.Candidate.findOne({
            where: { id: param.id },
        })
        let updateCandidate = null
        if (candidateInfo) {
            candidateInfo.fullName = param.fullName
            candidateInfo.birthDate = param.birthDate
            candidateInfo.gender = param.gender
            candidateInfo.perm_address = param.perm_address
            candidateInfo.perm_city = param.perm_city
            candidateInfo.perm_state = param.perm_state
            candidateInfo.perm_country = param.perm_country
            candidateInfo.perm_zip = param.perm_zip
            candidateInfo.curr_address = param.curr_address
            candidateInfo.curr_city = param.curr_city
            candidateInfo.curr_state = param.curr_state
            candidateInfo.curr_country = param.curr_country
            candidateInfo.curr_zip = param.curr_zip
            candidateInfo.email1 = param.email1
            candidateInfo.email2 = param.email2
            candidateInfo.contactNo1 = param.contactNo1
            candidateInfo.contactNo2 = param.contactNo2
            candidateInfo.aadharNo = param.aadharNo
            candidateInfo.isActive = param.isActive
            updateCandidate = await candidateInfo.save()
        }
        {
            transaction
        }

        const candidateOtherDetailsInfo = await customerDB.CandidateOtherDetails.findOne(
            {
                where: { candidateId: param.id },
            }
        )
        let updateCandidateOtherDetails = null
        if (candidateOtherDetailsInfo) {
            if (param.totalExpMonths)
                candidateOtherDetailsInfo.totalExpMonths = param.totalExpMonths
            if (param.totalExpYears)
                candidateOtherDetailsInfo.totalExpYears = param.totalExpYears
            candidateOtherDetailsInfo.registrationStatus =
                param.registrationStatus
            updateCandidateOtherDetails = await candidateOtherDetailsInfo.save()
        }
        {
            transaction
        }

        await transaction.commit()
        return Object.assign({ updateCandidate, updateCandidateOtherDetails })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while updateCandidateById")
        throw err
    }
}
/*
 * bulk Candidate
 */
interface bulkCreateCandidateParam {
    fullName: string
    birthDate?: Date | null
    gender?: "male" | "female" | "transgender" | null
    perm_address?: string | null
    perm_city?: string | null
    perm_state?: string | null
    perm_country?: string | null
    perm_zip?: string | null
    curr_address?: string | null
    curr_city?: string | null
    curr_state?: string | null
    curr_country?: string | null
    curr_zip?: string | null
    primary_email?: string | null
    secondary_email?: string | null
    primary_mobile: string
    secondary_mobile?: string | null
    aadharNo?: string | null
    isActive?: boolean | null
    totalExpMonths?: number | null
    totalExpYears?: number | null
    registrationStatus?: string | null
    candidateId?: number | null
}

const createBulkCandidate = async (param: Array<any>, userId: number) => {
    const transaction = await ormCustomer.transaction()
    const arrRejected: Array<any> = []
    const arrIgnored: Array<any> = []
    try {
        param = param.map((item, i) => {
            const row_num = i + 2
            return { ...item, row_num }
        })
        const _params: any = param.map((item, i) => {
            const rejected: any = {}
            const ignored: any = {}

            // industry
            let industry: any = helper.candidate.handleNotNullString(
                item.industry,
                80
            )
            if (industry && typeof industry === "object") {
                industry = "Other"
            }

            // category
            let category: any = helper.candidate.handleNotNullString(
                item.category,
                80
            )
            if (category && typeof category === "object") {
                rejected["category"] = category.error
                category = null
            }

            // fullName
            let fullName: any = helper.candidate.handleNotNullString(
                item.full_name,
                200
            )
            if (fullName && typeof fullName === "object") {
                rejected["full_name"] = fullName.error
                fullName = null
            }

            // contactNo1
            let contactNo1: any = helper.candidate.handleNotNullNumber(
                item.primary_mobile,
                45
            )
            if (contactNo1 && typeof contactNo1 === "object") {
                rejected["primary_mobile"] = contactNo1.error
                contactNo1 = null
            }

            // curr_address
            let curr_address: any = helper.candidate.handleString(
                item.curr_address,
                500
            )
            if (curr_address && typeof curr_address === "object") {
                ignored["curr_address"] = curr_address.error
                curr_address = null
            }

            // curr_city
            let curr_city: any = helper.candidate.handleNotNullString(
                item.curr_city,
                45
            )
            if (curr_city && typeof curr_city === "object") {
                rejected["curr_city"] = curr_city.error
                curr_city = null
            }

            // curr_state
            let curr_state: any = helper.candidate.handleString(
                item.curr_state,
                45
            )
            if (curr_state && typeof curr_state === "object") {
                ignored["curr_state"] = curr_state.error
                curr_state = null
            }

            // curr_country
            const curr_country = "India"

            // curr_zip
            let curr_zip: any = helper.candidate.handleNumber(
                item.curr_pincode,
                10
            )
            if (curr_zip && typeof curr_zip === "object") {
                ignored["curr_pincode"] = curr_zip.error
                curr_zip = null
            }

            // birthdate
            let birthDate: any = helper.candidate.handleDate(item.birth_date)
            if (birthDate && typeof birthDate == "object") {
                ignored["birth_date"] = birthDate.error
                birthDate = null
            }

            // gender
            let gender: any = helper.candidate.handleGender(item.gender)
            if (gender && typeof gender === "object") {
                ignored["gender"] = gender.error
                gender = null
            }

            // perm_address
            let perm_address: any = helper.candidate.handleString(
                item.perm_address,
                500
            )
            if (perm_address && typeof perm_address === "object") {
                ignored["perm_address"] = perm_address.error
                perm_address = null
            }

            // perm_city
            let perm_city: any = helper.candidate.handleString(
                item.perm_city,
                45
            )
            if (perm_city && typeof perm_city === "object") {
                ignored["perm_city"] = perm_city.error
                perm_city = null
            }

            // perm_state
            let perm_state: any = helper.candidate.handleString(
                item.perm_state,
                45
            )
            if (perm_state && typeof perm_state === "object") {
                ignored["perm_state"] = perm_state.error
                perm_state = null
            }

            // perm_country
            const perm_country = "India"

            // perm_zip
            let perm_zip: any = helper.candidate.handleNumber(
                item.perm_pincode,
                10
            )
            if (perm_zip && typeof perm_zip === "object") {
                ignored["perm_pincode"] = perm_zip.error
                perm_zip = null
            }

            // email1
            let email1: any = helper.candidate.handleEmail(
                item.primary_email,
                80
            )
            if (email1 && typeof email1 === "object") {
                ignored["primary_email"] = email1.error
                email1 = null
            }

            // email2
            let email2: any = helper.candidate.handleEmail(
                item.secondary_email,
                80
            )
            if (email2 && typeof email2 === "object") {
                ignored["secondary_email"] = email2.error
                email2 = null
            }

            // contactNo2
            let contactNo2: any = helper.candidate.handleNumber(
                item.secondary_mobile,
                45
            )
            if (contactNo2 && typeof contactNo2 === "object") {
                ignored["secondary_mobile"] = contactNo2.error
                contactNo2 = null
            }

            // aadharNo
            let aadharNo: any = helper.candidate.handleAadhar(item.aadhar_no)
            if (aadharNo && typeof aadharNo === "object") {
                ignored["aadhar_no"] = aadharNo.error
                aadharNo = null
            }

            // isActive
            const isActive = true

            // registrationStatus
            let registrationStatus: any = helper.candidate.handleString(
                item.registration_status,
                15
            )
            if (registrationStatus && typeof registrationStatus == "object") {
                ignored["registration_status"] = registrationStatus.error
                registrationStatus = null
            }

            // totalExpMonths
            let totalExpMonths: any = helper.candidate.handleNumber(
                item.exp_months
            )
            if (totalExpMonths && typeof totalExpMonths == "object") {
                ignored["exp_months"] = totalExpMonths.error
                totalExpMonths = null
            }

            // totalExpYears
            let totalExpYears: any = helper.candidate.handleNumber(
                item.exp_years
            )
            if (totalExpYears && typeof totalExpYears == "object") {
                ignored["exp_years"] = totalExpYears.error
                totalExpYears = null
            }

            // pref_location_1
            let pref_location_1: any = helper.candidate.handleString(
                item.pref_location_1,
                45
            )
            if (pref_location_1 && typeof pref_location_1 == "object") {
                ignored["pref_location_1"] = pref_location_1.error
                pref_location_1 = null
            }

            // pref_location_2
            let pref_location_2: any = helper.candidate.handleString(
                item.pref_location_2,
                45
            )
            if (pref_location_2 && typeof pref_location_2 == "object") {
                ignored["pref_location_2"] = pref_location_2.error
                pref_location_2 = null
            }

            // pref_location_3
            let pref_location_3: any = helper.candidate.handleString(
                item.pref_location_3,
                45
            )
            if (pref_location_3 && typeof pref_location_3 == "object") {
                ignored["pref_location_3"] = pref_location_3.error
                pref_location_3 = null
            }

            if (Object.keys(rejected).length) {
                rejected["rowNum"] = item.row_num
                arrRejected.push(rejected)
            }
            if (Object.keys(ignored).length) {
                ignored["rowNum"] = item.row_num
                arrIgnored.push(ignored)
            }
            return {
                fullName,
                birthDate,
                gender,
                perm_address,
                perm_city,
                perm_state,
                perm_country,
                perm_zip,
                curr_address,
                curr_city,
                curr_state,
                curr_country,
                curr_zip,
                email1,
                email2,
                contactNo1,
                contactNo2,
                aadharNo,
                isActive,
                registrationStatus,
                totalExpMonths,
                totalExpYears,
                industry,
                category,
                pref_location_1,
                pref_location_2,
                pref_location_3,
                rowNum: item.row_num,
                created_by: userId,
                modified_by: userId,
            }
        })

        // * remove null fullName, contactNo1, categoty and curr_city
        let filteredData = _params.filter(
            (item: any) =>
                item.fullName &&
                item.contactNo1 &&
                item.category &&
                item.curr_city
        )

        // * remove duplicate email1(primary_email) from excel
        const _deEmails = helper.candidate.findDuplicateFromExcel(
            filteredData,
            "email1",
            "primary_email",
            false
        )
        filteredData = _deEmails.arr
        _deEmails.arrIgnored.forEach((item) => arrIgnored.push(item))

        // * remove duplicate aadharNo(aadhar_no) from excel
        const _deAadharNos = helper.candidate.findDuplicateFromExcel(
            filteredData,
            "aadharNo",
            "aadhar_no",
            false
        )
        filteredData = _deAadharNos.arr
        _deAadharNos.arrIgnored.forEach((item) => arrIgnored.push(item))

        // * remove duplicate contactNo1(primary_mobile) from excel
        const _deContactNos = helper.candidate.findDuplicateFromExcel(
            filteredData,
            "contactNo1",
            "primary_mobile",
            true
        )
        filteredData = _deContactNos.arr
        _deContactNos.arrIgnored.forEach((item) => arrRejected.push(item))

        // * remove null fullName, contactNo1, categoty and curr_city
        filteredData = filteredData.filter(
            (item: any) =>
                item.fullName &&
                item.contactNo1 &&
                item.category &&
                item.curr_city
        )

        const duplicateFromDB = await customerDB.Candidate.findAndCountAll({
            attributes: ["email1", "contactNo1", "aadharNo"],
            where: {
                [Op.or]: [
                    {
                        email1: {
                            [Op.in]: filteredData.map(
                                (item: any) => item.fullName
                            ),
                        },
                    },
                    {
                        contactNo1: {
                            [Op.in]: filteredData.map(
                                (item: any) => item.contactNo1
                            ),
                        },
                    },
                    {
                        aadharNo: {
                            [Op.in]: filteredData.map(
                                (item: any) => item.aadharNo
                            ),
                        },
                    },
                ],
            },
            transaction,
        })
        const arrDuplicateFromDB = duplicateFromDB.rows.map((item) =>
            item.toJSON()
        )
        if (duplicateFromDB.count) {
            // * remove duplicate email1(primary_email) from db
            const _ddEmails = helper.candidate.findDuplicateFromDB(
                filteredData,
                arrDuplicateFromDB,
                "email1",
                "primary_email",
                false
            )
            filteredData = _ddEmails.arr
            _ddEmails.arrIgnored.forEach((item) => arrIgnored.push(item))

            // * remove duplicate aadharNo(aadhar_no) from db
            const _ddAadharNos = helper.candidate.findDuplicateFromDB(
                filteredData,
                arrDuplicateFromDB,
                "aadharNo",
                "aadhar_no",
                false
            )
            filteredData = _ddAadharNos.arr
            _ddAadharNos.arrIgnored.forEach((item) => arrIgnored.push(item))

            // * remove duplicate contactNo1(primary_mobile) from db
            const _ddContactNos = helper.candidate.findDuplicateFromDB(
                filteredData,
                arrDuplicateFromDB,
                "contactNo1",
                "primary_mobile",
                true
            )
            console.log(_ddContactNos.arrIgnored.length)
            filteredData = _ddContactNos.arr
            _ddContactNos.arrIgnored.forEach((item) => arrRejected.push(item))

            // * remove null fullName, contactNo1, categoty and curr_city
            filteredData = filteredData.filter(
                (item: any) =>
                    item.fullName &&
                    item.contactNo1 &&
                    item.category &&
                    item.curr_city
            )
        }

        const rowNums = [
            ...new Set([
                ...arrRejected.map((item) => item.rowNum),
                ...arrIgnored.map((item) => item.rowNum),
            ]),
        ]

        const arrSummary = param.filter((item: any, i: number) =>
            rowNums.includes(i + 2)
        )

        const candidate = await customerDB.Candidate.bulkCreate(filteredData, {
            fields: [
                "fullName",
                "birthDate",
                "gender",
                "perm_address",
                "perm_city",
                "perm_state",
                "perm_country",
                "perm_zip",
                "curr_address",
                "curr_city",
                "curr_state",
                "curr_country",
                "curr_zip",
                "email1",
                "email2",
                "contactNo1",
                "contactNo2",
                "aadharNo",
                "isActive",
                "created_by",
                "modified_by",
            ],
            transaction,
        })
        const arrOtherDetails = candidate.map((item, ind) => {
            const {
                totalExpMonths,
                totalExpYears,
                registrationStatus,
            } = _params[ind]
            return {
                totalExpMonths,
                totalExpYears,
                registrationStatus,
                candidateId: item.id as number,
                created_by: userId,
                modified_by: userId,
            }
        })
        const candidateother = await customerDB.CandidateOtherDetails.bulkCreate(
            arrOtherDetails,
            {
                fields: [
                    "totalExpMonths",
                    "totalExpYears",
                    "registrationStatus",
                    "candidateId",
                    "created_by",
                    "modified_by",
                ],
                transaction,
            }
        )

        //

        await transaction.commit()
        // return Object.assign({ candidate, candidateother })
        return helper.getHandlerResponseObject(
            true,
            helper.httpStatus.Created,
            `${candidate.length} Candidates uploaded successfully`,
            { arrRejected, arrIgnored, arrSummary }
        )
    } catch (err: any) {
        await transaction.rollback()
        // console.log(err)
        // log.error(err, "Error while createBulkCandidate")
        throw err
    }
}

/*
 * create Candidate Traning certificate
 */
interface createCandidateTrainingCertParam {
    type: "training" | "certificate" | "other"
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: any
}

const addCandidateTrainingCert = async (
    param: createCandidateTrainingCertParam
) => {
    let getskillId: any
    if (param.skillId == undefined || param.skillId == null) {
        getskillId = null
    } else {
        if (typeof param.skillId !== "number") {
            const newSkillset = await customerDB.SkillSet.create({
                title: param.skillId,
            })
            getskillId = newSkillset.id
        } else {
            getskillId = param.skillId
        }
    }
    const candidateCertificate = await customerDB.CandidateCertificate.create({
        type: param.type,
        title: param.title,
        issueDate: param.issueDate,
        issuedBy: param.issuedBy,
        description: param.description,
        candidateId: param.candidate,
        skillId: getskillId,
    }).catch((err: any) => {
        log.error(err, "Error while addCandidateTrainingCert")
        throw err
    })
    return candidateCertificate
}
/*
 * get Candidate Traning certificate By Id
 */
const getCandidateTrainingCertById = async (id: number, certId: number) => {
    const candidateCertificate = await customerDB.CandidateCertificate.findOne({
        include: [{ model: customerDB.SkillSet }],
        where: {
            id: certId,
            candidateId: id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateTrainingCertById")
        throw err
    })
    return candidateCertificate
}
/*
 * update Candidate Traning certificate By Id
 */
interface updateCandidateTrainingCertParam {
    id: number
    type: "training" | "certificate" | "other"
    title: string
    issueDate: Date
    issuedBy: string
    description: string
    candidate: number
    skillId: number
}

const updateCandidateTrainingCertById = async (
    param: updateCandidateTrainingCertParam
) => {
    const candidateCertificate = await customerDB.CandidateCertificate.findOne({
        where: { id: param.id },
    })
    let getskillId: any
    if (param.skillId == undefined || param.skillId == null) {
        getskillId = null
    } else {
        if (typeof param.skillId !== "number") {
            const newSkillset = await customerDB.SkillSet.create({
                title: param.skillId,
            })
            getskillId = newSkillset.id
        } else {
            getskillId = param.skillId
        }
    }
    let updateCandidateCertificate = null
    if (candidateCertificate) {
        candidateCertificate.type = param.type
        candidateCertificate.title = param.title
        candidateCertificate.issueDate = param.issueDate
        candidateCertificate.issuedBy = param.issuedBy
        candidateCertificate.description = param.description
        candidateCertificate.candidateId = param.candidate
        candidateCertificate.skillId = getskillId
        updateCandidateCertificate = await candidateCertificate
            .save()
            .catch((err: any) => {
                log.error(err, "Error while updateCandidateTrainingCertById")
                throw err
            })
        return updateCandidateCertificate
    }
}
/*
 * remove Candidate Traning certificate By Id
 */

interface removeCandidateTrainingCertParam {
    id: number
}
const removeCandidateTrainingCert = async (
    param: removeCandidateTrainingCertParam
) => {
    const deletedRows = await customerDB.CandidateCertificate.destroy({
        where: {
            id: param.id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateTrainingCert")
        throw err
    })
    return deletedRows
}
/*
 * get Candidate workHistory By Id
 */

const getCandidateWorkHistoryById = async (id: number, workId: number) => {
    const candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne({
        where: {
            id: workId,
            candidateId: id,
        },
        include: [
            { model: customerDB.CandidateWorkHistorySkill },
            { model: customerDB.Company },
        ],
    }).catch((err: any) => {
        log.error(err, "Error while getCandidateWorkHistoryById")
        throw err
    })
    return candidateWorkHistory
}
/*
 * create Candidate workHistory By Id
 */
interface createCandidateWorkHistoryParam {
    startDate: Date
    endDate: Date
    description: string
    companyId: number
    skillId: any
    workHistoryId: any
    candidate: number
}

const addCandidateWorkHistory = async (
    param: createCandidateWorkHistoryParam
) => {
    const transaction = await ormCustomer.transaction()
    try {
        let skillsSetArray = []
        const skills: any = []
        const newSkills: any = []

        skillsSetArray = param.skillId
        skillsSetArray.map((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })
        const NewskillsArrayObject = newSkills.map((item: any) => {
            return { title: item }
        })
        const skillSet = await customerDB.SkillSet.bulkCreate(
            NewskillsArrayObject,
            {
                fields: ["id", "title"],
                transaction,
            }
        )
        const candidateWorkHistory = await customerDB.CandidateWorkHistory.create(
            {
                startDate: param.startDate,
                endDate: param.endDate,
                description: param.description,
                candidateId: param.candidate,
                companyId: param.companyId,
            },
            {
                fields: [
                    "startDate",
                    "endDate",
                    "description",
                    "candidateId",
                    "companyId",
                ],
                transaction,
            }
        )
        const getSkillId = skillSet.map((item) => {
            return {
                skillId: item.id,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        const skillsArrayObject = skills.map((item: any) => {
            return {
                skillId: item,
                workHistoryId: candidateWorkHistory.id,
            }
        })
        const workHistorySkill = [...skillsArrayObject, ...getSkillId]

        const candidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.bulkCreate(
            workHistorySkill,
            {
                fields: ["skillId", "workHistoryId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            skillSet,
            candidateWorkHistory,
            candidateWorkHistorySkill,
        })
    } catch (err: any) {
        await transaction.rollback()
        log.error(err, "Error while addCandidateWorkHistory")
        throw err
    }
}
/*
 * update Candidate workHistory By Id
 */
interface updateCandidateWorkHistoryParam {
    id: number
    startDate: Date
    endDate: Date
    description: string
    candidate: number
    companyId: number
    skillId: any
}

const updateCandidateWorkHistoryById = async (
    param: updateCandidateWorkHistoryParam
) => {
    const transaction = await ormCustomer.transaction()
    try {
        const candidateWorkHistory = await customerDB.CandidateWorkHistory.findOne(
            {
                where: { id: param.id },
            }
        )

        const deleteCandidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.destroy(
            {
                where: {
                    workHistoryId: param.id,
                },
                transaction,
            }
        )

        let skillsSetArray = []
        const skills: any = []
        const newSkills: any = []

        skillsSetArray = param.skillId
        skillsSetArray.map((items: any) => {
            if (typeof items == "number") {
                skills.push(items)
            } else {
                newSkills.push(items)
            }
        })
        const NewskillsArrayObject = newSkills.map((item: any) => {
            return { title: item }
        })
        const skillSet = await customerDB.SkillSet.bulkCreate(
            NewskillsArrayObject,
            {
                fields: ["id", "title"],
                transaction,
            }
        )

        let updateCandidateWcandidateWorkHistory = null
        if (candidateWorkHistory) {
            candidateWorkHistory.startDate = param.startDate
            candidateWorkHistory.endDate = param.endDate
            candidateWorkHistory.description = param.description
            candidateWorkHistory.candidateId = param.candidate
            candidateWorkHistory.companyId = param.companyId
            updateCandidateWcandidateWorkHistory = await candidateWorkHistory.save()
        }
        {
            transaction
        }
        const getSkillId = skillSet.map((item) => {
            return {
                skillId: item.id,
                workHistoryId: candidateWorkHistory?.id,
            }
        })
        const skillsArrayObject = skills.map((item: any) => {
            return {
                skillId: item,
                workHistoryId: candidateWorkHistory?.id,
            }
        })
        const workHistorySkill = [...skillsArrayObject, ...getSkillId]
        const candidateWorkHistorySkill = await customerDB.CandidateWorkHistorySkill.bulkCreate(
            workHistorySkill,
            {
                fields: ["skillId", "workHistoryId"],
                transaction,
            }
        )
        await transaction.commit()
        return Object.assign({
            skillSet,
            updateCandidateWcandidateWorkHistory,
            candidateWorkHistorySkill,
        })
    } catch (err) {
        await transaction.rollback()
        log.error(err, "Error while updateCandidateWorkHistoryById")
        throw err
    }
}
/*
 * remove Candidate workHistory By Id
 */
interface removeCandidateWorkHistoryParam {
    id: number
}
const removeCandidateWorkHistory = async (
    param: removeCandidateWorkHistoryParam
) => {
    const deletedRows = await customerDB.CandidateWorkHistory.destroy({
        where: {
            id: param.id,
        },
    }).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        throw err
    })
    return deletedRows
}
/*
 * get Candidate workHistory By Id
 */
const getCandidatesWorkHistory = async (id: number) => {
    const candidatesWorkHistory = await customerDB.CandidateWorkHistory.findAll(
        {
            include: [
                { model: customerDB.CandidateWorkHistorySkill },
                { model: customerDB.Company },
            ],
            where: {
                candidateId: id,
            },
        }
    ).catch((err: any) => {
        log.error(err, "Error while removeCandidateWorkHistory")
        throw err
    })
    return candidatesWorkHistory
}

/*
 * get Candidate Traning Certificate
 */

const getCandidateTrainingCert = async (id: number) => {
    const candidatesCertificate = await customerDB.CandidateCertificate.findAll(
        {
            include: [{ model: customerDB.SkillSet }],
            where: {
                candidateId: id,
            },
        }
    ).catch((err: any) => {
        log.error(err, "Error while getCandidateTrainingCert")
        //(err)
        throw err
    })
    return candidatesCertificate
}
const Candidate = {
    getCandidates,
    getCandidateById,
    createCandidate,
    updateCandidateById,
    deleteAllCandiate,
    deleteCandiateById,
    addCandidateTrainingCert,
    updateCandidateTrainingCertById,
    removeCandidateTrainingCert,
    addCandidateWorkHistory,
    updateCandidateWorkHistoryById,
    removeCandidateWorkHistory,
    createBulkCandidate,
    getCandidatesWorkHistory,
    getCandidateTrainingCert,
    getCandidateTrainingCertById,
    getCandidateWorkHistoryById,
}

export { Candidate }
