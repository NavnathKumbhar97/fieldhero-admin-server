import { expect } from "chai"
import "mocha"
import axios from "axios"
// local imports

describe("First test", () => {
    it("Test server is ruinning", async () => {
        const result = await axios.get(`http://localhost:1234/`)
        expect(result.status).to.equal(200)
        expect(result.data).to.equal("API Working")
    })
    it("Check unrecognized routes", async () => {
        const result = await axios.get(`http://localhost:1234/asd`)
        expect(result.status).to.equal(400)
        // expect(result.data).to.equal("API Working")
    })
})
