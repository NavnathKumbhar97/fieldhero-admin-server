import request from "supertest"
// local imports
import app from "../src/app"
let token: string | null = null
beforeAll(async () => {
    const response = await request(app).post("/api/v1/users/login").send({
        email: "chirag.shah@apexa.in",
        password: "1234",
    })
    token = response.body.token
})

afterAll((done) => {
    done()
})

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

describe("Test Agent Module", () => {
    test("Create an Agent", async () => {
        const response = await request(app)
            .post("/api/v1/agents")
            .set("Authorization", "Bearer " + token)
            .send({
                fullName: "John Doe",
                gender: "MALE",
                email: "kayegaws113@ddwfzp.com",
            })
        expect(response.status).toBe(201)
        expect(response.body.code).toBe(201)
        expect(response.body.message).toBe("Agent created successfully")
    })
})
