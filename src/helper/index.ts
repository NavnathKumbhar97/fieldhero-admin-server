import log from "./log"
import httpStatus from "./http_status"
import getPagingData from "./pagination"
import permissions from "./permissions"
import { passwordfunction } from "./password"
const getExpiryTime = () => {
    return Date.now() + 3600000
}
export {
    log,
    httpStatus,
    passwordfunction,
    getPagingData,
    getExpiryTime,
    permissions,
}
