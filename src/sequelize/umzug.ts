import Umzug from "umzug"
import { orm } from "../sequelize"
import path from "path"

const uz = new Umzug({
    migrations: {
        path: path.join(__dirname, "migrations"),
        params: [orm.getQueryInterface()],
        pattern: /\d{2}_.*\.(t|j)s$/,
    },
    storage: "sequelize",
    storageOptions: {
        sequelize: orm,
    },
})

export { uz as umzug }
