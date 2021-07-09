import express, { Express, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
// local imports"
import { routerV1 } from "./router"

const isBulkCandidateUpload = (req: Request) => {
    if (req.path === "/api/v1/bulkcandidates") return true
    return false
}

const app: Express = express()
app.use(cors())
const parseJSON = express.json()
app.use((req, res, next) =>
    isBulkCandidateUpload(req) ? next() : parseJSON(req, res, next)
)
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

app.use("/api/v1", routerV1)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("API Working")
})

export default app
