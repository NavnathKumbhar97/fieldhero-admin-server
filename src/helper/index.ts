import log from "./log"
import httpStatus from "./http_status"
import getPagingData from "./pagination"
const getExpiryTime = () => {
    return Date.now() + 3600000
}
export { log, httpStatus, getPagingData, getExpiryTime }
