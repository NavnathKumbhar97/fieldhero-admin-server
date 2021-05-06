import moment from "moment"
import log from "./log"
import httpStatus from "./http_status"
import permissions from "./permissions"
import { passwordfunction } from "./password"
import candidate from "./candidate"
const getExpiryTime = (): number => {
    return Date.now() + 3600000
}

const getGender = (): Array<string> => {
    return ["MALE", "FEMALE", "OTHER"]
}

const parseDate = (date: string): moment.Moment | null => {
    if (moment(date, "DD.MM.YY", true).isValid())
        return moment(date, "DD.MM.YY", true)
    else if (moment(date, "DD-MM-YY", true).isValid())
        return moment(date, "DD-MM-YY", true)
    else if (moment(date, "DD/MM/YY", true).isValid())
        return moment(date, "DD/MM/YY", true)
    else if (moment(date, "DD.MM.YYYY", true).isValid())
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
        return moment(date, "YYYY/MM/DD", true)
    else if (moment(date, true).isValid()) return moment(date)
    else return null
}

type IResponseObject = {
    status: boolean
    code: number
    message: string
    data?: any | null
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

const getUserLoginId = (user: unknown): number => {
    return (user as { loginId: number }).loginId
}

export {
    log,
    httpStatus,
    passwordfunction,
    getExpiryTime,
    getGender,
    IResponseObject,
    getHandlerResponseObject,
    permissions,
    parseDate,
    candidate,
    getUserLoginId,
}
