import { Response } from "express"
// local imports
import { httpStatus } from "../helper"

const handleRouterError = (res: Response, error: any) => {
    res.status(httpStatus.Bad_Request).json({
        code: httpStatus.Bad_Request,
        message: error.message,
    })
}
const express = {
    handleRouterError,
}
export { express }
