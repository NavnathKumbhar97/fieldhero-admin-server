import { Request, Response, NextFunction } from "express"
import { customerDB } from "../../sequelize"
import { httpStatus } from "../../helper"

export default (permissionTocheck: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const _user: any = req.user
        try {
            const role = await customerDB.Role.findOne({
                where: { uuid: _user.role.uuid },
                include: [
                    {
                        model: customerDB.RolePermission,
                        attributes: ["permissionId"],
                    },
                ],
            })
            if (role && Object.keys(role).length) {
                try {
                    const _role: any = role.toJSON()
                    const permissions = _role.role_permissions.map(
                        (perm: any) => perm.permissionId
                    )
                    const isPermitted = permissions.includes(permissionTocheck)
                    if (isPermitted) {
                        next()
                    } else {
                        // if permission not available in role
                        res.status(httpStatus.Unauthorized).send("Unauthorized")
                    }
                } catch (error) {
                    res.status(httpStatus.Unauthorized).send("Unauthorized")
                }
            } else {
                // if role not found
                res.status(httpStatus.Unauthorized).send("Unauthorized")
            }
        } catch (error) {
            res.status(httpStatus.Bad_Request).json({
                code: httpStatus.Bad_Request,
                error: error,
            })
        }
    }
}
