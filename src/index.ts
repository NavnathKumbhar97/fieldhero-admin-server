import express, { Express, Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import bodyparser from "body-parser"
import pino from "pino-http"
// local imports
import * as config from "./config"
import { log } from "./helper"
import * as sequelize from "./sequelize/umzug"

sequelize.umzug.pending().then((migrations) => {
    console.log(migrations)
    sequelize.umzug
        .up()
        .then(() => console.log("success"))
        .catch((err) => console.log("failed", err))
})

const app: Express = express()
app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(helmet())
// configure pino logging with express
app.use(pino({ logger: log }))

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("API Working")
})

app.listen(config.PORT, (): void => {
    log.info("Server started on port " + config.PORT)
})
