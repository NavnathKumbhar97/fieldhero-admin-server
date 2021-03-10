import moment from "moment"
import log from "./log"
import httpStatus from "./http_status"
import getPagingData from "./pagination"
import permissions from "./permissions"
import { passwordfunction } from "./password"
import candidate from "./candidate"
const getExpiryTime = () => {
    return Date.now() + 3600000
}

const getGender = () => {
    return ["male", "female", "other"]
}

const parseDate = (date: string): moment.Moment | null => {
    if (moment(date, "DD.MM.YYYY", true).isValid())
        return moment(date, "DD.MM.YYYY", true)
    else if (moment(date, "DD-MM-YYYY", true).isValid())
        return moment(date, "DD-MM-YYYY", true)
    else if (moment(date, "DD/MM/YYYY", true).isValid())
        return moment(date, "DD/MM/YYYY", true)
    else if (moment(date, "YYYY.MM.DD", true).isValid())
        return moment(date, "YYYY.MM.DD", true)
    else if (moment(date, "YYYY-MM-DD", true).isValid())
        return moment(date, "YYYY-MM-DD", true)
    else if (moment(date, "YYYY/MM/DD", true).isValid())
        return moment(date, "YYYY/M/MDD", true)
    else return null
}

interface IResponseObject {
    status: boolean
    code: number
    message: string
    data: any | null
}
const getHandlerResponseObject = (
    status: boolean,
    code: number,
    message: string,
    data: any = null
): IResponseObject => {
    return {
        status,
        code,
        message,
        data,
    }
}

const getUserLoginId = (user: any): number => {
    return user.loginId
}

export {
    log,
    httpStatus,
    passwordfunction,
    getPagingData,
    getExpiryTime,
    getGender,
    IResponseObject,
    getHandlerResponseObject,
    permissions,
    parseDate,
    candidate,
    getUserLoginId,
}
