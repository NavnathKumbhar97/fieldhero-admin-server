import express, { Express, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import bodyparser from "body-parser"
import pino from "pino-http"
// local imports
import * as config from "./config"
import { log } from "./helper"
import { routerV1 } from "./router"
// import * as sequelize from "./sequelize/umzug"

// sequelize.umzugCustomer.pending().then((migrations) => {
//     log.info(migrations.map((m) => m.file))
//     sequelize.umzugCustomer
//         .up()
//         .then(() => log.info("success"))
//         .catch((err) => log.error(err, "failed"))
// })

const isBulkCandidateUpload = (req: Request) => {
    if (req.path === "/api/v1/bulkcandidates") return true
    return false
}

const app: Express = express()
app.use(cors())
const parseJSON = bodyparser.json()
app.use((req, res, next) =>
    isBulkCandidateUpload(req) ? next() : parseJSON(req, res, next)
)
app.use(bodyparser.urlencoded({ extended: false }))
app.use(helmet())
// configure pino logging with express
app.use(pino({ logger: log }))

app.use("/api/v1", routerV1)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("API Working")
})

app.listen(config.PORT, (): void => {
    log.info("Server started on port " + config.PORT)
})
