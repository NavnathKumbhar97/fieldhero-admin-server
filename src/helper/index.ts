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

export {
    log,
    httpStatus,
    passwordfunction,
    getPagingData,
    getExpiryTime,
    permissions,
    parseDate,
    candidate,
}
