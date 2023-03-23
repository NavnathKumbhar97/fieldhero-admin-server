import { Router, Request, Response, NextFunction } from "express"
import { AuditLog } from "../handlers/audit_log"

import { httpStatus, permissions } from "../helper/"
// import * as middleware from "./middleware"

const AuditLogRouter = Router()

// Add Audit-log 
AuditLogRouter.post(
    "/:sectionId/audit-log/:dataId",
    (req: Request<any>, res: Response, next: NextFunction) => {
        AuditLog.createAuditLog(req.body,parseInt(req.params.sectionId), parseInt(req.params.dataId))
            .then((audit) => {
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
AuditLogRouter.get(
    "/:sectionId/audit-log/:dataId",
    (req: Request<any>, res: Response, next: NextFunction) => {
        AuditLog.getAllAuditLog(parseInt(req.params.sectionId), parseInt(req.params.dataId))
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

AuditLogRouter.get(
    "/audit-log/:id",
    (req: Request<any>, res: Response, next: NextFunction) => {
        AuditLog.getAuditLogById(parseInt(req.params.id))
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

export { AuditLogRouter }
