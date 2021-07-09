// local imports
import app from "./app"
import * as config from "./config"
import { log } from "./helper"

app.listen(config.PORT, (): void => {
    log.info("Server started on port " + config.PORT)
    console.log("Server started on port " + config.PORT)
})
