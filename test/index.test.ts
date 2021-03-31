import request from "supertest"
// local imports
import app from "../src/app"

describe("test root path", () => {
    test("It should respond to GET method", async () => {
        const response = await request(app).get("/")
        expect(response.status).toBe(200)
        expect(response.body).toBe("API Working")
    })

    test("Check unrecognized routes", async () => {
        const response = await request(app).get(`/asd`)
        expect(response.status).toBe(404)
        
    })
})
