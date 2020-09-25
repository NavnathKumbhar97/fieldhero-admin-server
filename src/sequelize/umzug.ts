import Umzug from "umzug"
import { ormCustomer } from "../sequelize"
import path from "path"

const uz = new Umzug({
    migrations: {
        path: path.join(__dirname, "migrations"),
        params: [ormCustomer.getQueryInterface()],
        pattern: /\d{2}_.*\.(t|j)s$/,
    },
    storage: "sequelize",
    storageOptions: {
        sequelize: ormCustomer,
    },
})

export { uz as umzugCustomer }
