import Joi from "joi"
import { Request, Response, NextFunction } from "express"

const createSkillSet = Joi.object().keys({
    title: Joi.string().max(45).required(),
    description: Joi.string().max(100).allow(''),
})

const createSkillSetValidation = async (req: Request,res: Response,next: NextFunction)=>{
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    }
    const { error, value } = await createSkillSet.validate(req.body, options)
    if (error) {
        res.json({
            status: 400,
            error: "Error",
            Message: error.details
                .map((i, index) => {
                    return JSON.stringify({
                        message: i.message
                    })
                })
                .join(", "),
        })
    } else {
        next()
    }
}

export { createSkillSetValidation }
