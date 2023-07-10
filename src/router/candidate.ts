import { Router, Request, Response, json as bodyParserJson } from "express"
// local imports
import * as middleware from "./middleware"
import * as handler from "../handlers"
import * as helper from "../helper"
import { body, check, matchedData, param, query, validationResult } from "express-validator"

const CandidateRouter = Router()

//* Fetch all Candidate
CandidateRouter.get(
    "/candidates",
    middleware.permission(helper.permissions.candidate_read_all),
    async (req: Request, res: Response) => {
        try {
            console.log(req.query)
            const result = await handler.Candidate.getCandidates(
                req.query as any
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)
CandidateRouter.get(
    "/filter-candidate",
    middleware.permission(helper.permissions.candidate_read_all),
    check("fullName").notEmpty().withMessage("Full Name is required"),
    check("contact").notEmpty().withMessage("Contact number is required"),
    async (req: Request, res: Response) => {
        try {
                  // Check for validation errors
      const errors = validationResult(req);      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
            const result = await handler.Candidate.filterRecords(
                req.query as any,
                parseInt(req.params.id),
                req.params.fullName,
                req.params.contact,
                // req.params.status,
                // req.params.id
                
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

CandidateRouter.get(
    "/candidates/passive",
    middleware.permission(helper.permissions.candidate_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.fetchAllPassive()
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Fetch Candidate by Id
CandidateRouter.get(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_read),
    param("id").notEmpty().withMessage("Candidate id required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);      
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result = await handler.Candidate.getCandidateById(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* create candidate
CandidateRouter.post(
    "/candidates",
    middleware.permission(helper.permissions.candidate_create),
    body("gender").notEmpty().withMessage("Please select Gender"),
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("email1").notEmpty().withMessage("Email is required"),
    body("contactNo1").notEmpty().withMessage("Primary contact is required"),
    body("aadharNo").notEmpty().withMessage("Aadhar Number is required"),
    async (req: Request, res: Response) => {
        try {

            // Check for validation errors
      const errors = validationResult(req);      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }     
            const result = await handler.Candidate.createCandidate(
                helper.getUserLoginId(req.user),
                req.body
                
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error:any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update candiate
CandidateRouter.put(
    "/candidates/:id",
    middleware.permission(helper.permissions.candidate_update),
    body("gender").notEmpty().withMessage("Please select Gender"),
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("email1").notEmpty().withMessage("Email is required"),
    body("contactNo1").notEmpty().withMessage("Primary contact is required"),
    body("aadharNo").notEmpty().withMessage("Aadhar Number is required"),
    check("id").notEmpty().withMessage("Candidate id required"),
    async (req: Request, res: Response) => {
        try {
                   // Check for validation errors
                const errors = validationResult(req);
                
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                } 
            const result = await handler.Candidate.updateCandidateById(
                helper.getUserLoginId(req.user),
                {
                    id: req.params.id,
                    ...req.body,
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* bulk create candidates
CandidateRouter.post(
    "/bulkcandidates",
    // 50mb
    bodyParserJson({ limit: 1024 * 1024 * 50 }),
    middleware.permission(helper.permissions.candidate_basic_bulk_create),
    body("gender").notEmpty().withMessage("Please select Gender"),
    body("fullName").notEmpty().withMessage("Full Name is required"),
    body("email1").notEmpty().withMessage("Email is required"),
    body("contactNo1").notEmpty().withMessage("Primary contact is required"),
    body("aadharNo").notEmpty().withMessage("Aadhar Number is required"),
    async (req: Request, res: Response) => {
        try {
               // Check for validation errors
               const errors = validationResult(req);
                
               if (!errors.isEmpty()) {
                   return res.status(400).json({ errors: errors.array() });
               } 
            const result = await handler.Candidate.createCandidateRaw(
                helper.getUserLoginId(req.user),
                helper.getUserLoginId(req.user),
                req.body
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candidate work history
CandidateRouter.get(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_read_all),
    param("id").notEmpty().withMessage("Candidate id required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);      
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await handler.Candidate.getCandidatesWorkHistory(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candiate  work History By Id
CandidateRouter.get(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_read),
    param("id").notEmpty().withMessage("Candidate id required"),
    param("workId").notEmpty().withMessage("Candidate work id required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);      
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result = await handler.Candidate.getCandidateWorkHistoryById(
                parseInt(req.params.id),
                parseInt(req.params.workId)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Candiate Work History
CandidateRouter.post(
    "/candidates/:id/work-history",
    middleware.permission(helper.permissions.candidate_work_history_create),
    param("id").notEmpty().withMessage("Candidate id required"),
    body("companyId").notEmpty().withMessage("Company id required"),
    body("endDate").notEmpty().withMessage("End Date required"),
    body("skillId").notEmpty().withMessage("Start Date required"),
    body("startDate").notEmpty().withMessage("Skills required"),

    async (req: Request, res: Response) => {
        try {
               // Check for validation errors
               const errors = validationResult(req); 
               if (!errors.isEmpty()) {
                   return res.status(400).json({ errors: errors.array() });
               } 
            const result = await handler.Candidate.addCandidateWorkHistory(
                helper.getUserLoginId(req.user),
                {
                    ...req.body,
                    candidate: parseInt(req.params.id),
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Update Candiate WorkHistory
CandidateRouter.put(
    "/candidates/:id/work-history/:workId",
    middleware.permission(helper.permissions.candidate_work_history_update),
    param("id").notEmpty().withMessage("Candidate id required"),
    // param("workid").notEmpty().withMessage("Candidate id required"),
    body("companyId").notEmpty().withMessage("Company id required"),
    body("endDate").notEmpty().withMessage("End Date required"),
    body("skillId").notEmpty().withMessage("Start Date required"),
    body("startDate").notEmpty().withMessage("Skills required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result =
                await handler.Candidate.updateCandidateWorkHistoryById(
                    helper.getUserLoginId(req.user),
                    {
                        id: parseInt(req.params.workId),
                        candidate: req.params.id,
                        ...req.body,
                    }
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candidate Work History
CandidateRouter.delete(
    "/candidates/:id/work-history/:workId",
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.removeCandidateWorkHistory({
                id: parseInt(req.params.workId),
            })
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candidate training/certificate history
CandidateRouter.get(
    "/candidates/:id/training-history",
    middleware.permission(helper.permissions.candidate_certification_read),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidatesTrainingCert(
                parseInt(req.params.id)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* get Candiate  training/certificate History By Id
CandidateRouter.get(
    "/candidates/:id/training-history/:trainingCertId",
    middleware.permission(helper.permissions.candidate_certification_read_all),
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.getCandidateTrainingCertHistoryById(
                parseInt(req.params.id),
                parseInt(req.params.trainingCertId)
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Create Candiate training/certificate History
CandidateRouter.post(
    "/candidates/:id/training-cert",
    middleware.permission(helper.permissions.candidate_certification_create),
    body("issuedBy").notEmpty().withMessage("Please select Issued By"),
    body("title").notEmpty().withMessage("Title is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result = await handler.Candidate.addCandidateTraining(
                helper.getUserLoginId(req.user),
                {
                    ...req.body,
                    candidate: parseInt(req.params.id),
                }
            )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)


//* Update Candiate training/certificate history
CandidateRouter.put(
    "/candidates/:id/training-history/:trainingCertId",
    middleware.permission(helper.permissions.candidate_certification_update),
    body("issuedBy").notEmpty().withMessage("Please select Issued By"),
    body("title").notEmpty().withMessage("Title is required"),
    async (req: Request, res: Response) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
                
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            } 
            const result =
                await handler.Candidate.updateCandidateTrainingCertHistoryById(
                    helper.getUserLoginId(req.user),
                    {
                        id: parseInt(req.params.trainingCertId),
                        candidate: req.params.id,
                        ...req.body,
                    }
                )
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)

//* Delete Candidate training/certificate History
CandidateRouter.delete(
    "/candidates/:id/training-history/:trainingCertId",
    async (req: Request, res: Response) => {
        try {
            const result = await handler.Candidate.removeCandidateTrainingCertHistory({
                id: parseInt(req.params.trainingCertId),
            })
            const { code, data, message } = result
            res.status(code).json({ code, message, data })
        } catch (error: any) {
            handler.express.handleRouterError(res, error)
        }
    }
)


export { CandidateRouter }
