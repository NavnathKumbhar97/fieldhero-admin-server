import { Router, Request, Response, NextFunction } from "express"
import { UserActivity } from "../handlers/userActivity"

import helper, { httpStatus, permissions } from "../helper/"
// import * as middleware from "./middleware"

const UserActivityRouter = Router()

// Add UserActivity
UserActivityRouter.post(
    "/:sectionId/user-activity/:userLoginId",
    (req: Request<any>, res: Response, next: NextFunction) => 
    {
        UserActivity.createUserActivity(
            req.body,
            parseInt(req.params.sectionId), 
            ).then((audit) => 
            {
                res.status(httpStatus.Created).json(audit)
            })
            .catch((err) => {
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            })
    }
)

/**
 * All Audit Section
 */
UserActivityRouter.get(
    "/all-userActivity",
    (req: Request<any>, res: Response, next: NextFunction) => {
        UserActivity.getAllUserActivity()
            .then((audit) => {
                if (audit == null) {
                    res.sendStatus(httpStatus.No_Content)
                } else {
                    res.status(httpStatus.OK).json(audit)
                }
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)
/**
 * Get Sigle Audit log 
 */

UserActivityRouter.get(
    "/userActivity/:userId",
    (req: Request<any>, res: Response, next: NextFunction) => {
        UserActivity.getUserActivityById(parseInt(req.params.userId))
            .then((audit) => {
                if (audit == null) {
                    res.sendStatus(httpStatus.No_Content)
                } else {
                    res.status(httpStatus.OK).json(audit)
                }
            })
            .catch((err) =>
                res.status(httpStatus.Bad_Request).json({
                    code: httpStatus.Bad_Request,
                    error: err,
                })
            )
    }
)

export { UserActivityRouter }
