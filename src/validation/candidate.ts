import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const createCandidate = Joi.object().keys({
    fullName: Joi.string().required(),
    email1: Joi.string().email().required(),
    contactNo1: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
})

const createCandidateValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    }
    const createCandidates = Joi.array().items(createCandidate)
    const { error, value } = await createCandidates.validate(req.body, options)
    if (error) {
        res.json({
            status: 400,
            error: "Error",
            Message: error.details
                .map((i, index) => {
                    return JSON.stringify({
                        message: i.message,
                        index: i.path[0],
                    })
                })
                .join(", "),
        })
    } else {
        next()
    }
}

export { createCandidateValidation }
