import { Request, Response, NextFunction } from "express"
// local imports
import { httpStatus, log } from "../../helper"
import prisma from "../../prisma"

export default (permissionTocheck: number) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => 
    {
        const _user = req.user as { role: { uuid: string } }
        try 
        {
            const role = await prisma.role.findFirst({
                where: {
                    uuid: _user.role.uuid,
                },
                include: {
                    RolePermission: {
                        select: {
                            permissionId: true,
                        },
                    },
                },
            })
            if (!role) 
            {
                res.status(httpStatus.Forbidden).send("Forbidden")
                return
            }


            const permissions = role.RolePermission.map(
                (perm) => perm.permissionId
            )

            const isPermitted = permissions.includes(permissionTocheck)
            if (!isPermitted) 
            {
                res.status(httpStatus.Forbidden).send("Forbidden")
                return
            }

            next()

        } catch (error: any) 
        {
            log.error(error.message, "Error in permission middleware")
            res.status(httpStatus.Forbidden).send("Forbidden")
        }
    }
}
