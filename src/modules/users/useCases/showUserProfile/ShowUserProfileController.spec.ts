import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should show an user profile correctly", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    const sessionsResponse = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "123456",
    });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${sessionsResponse.body.token as string}`,
      });

    expect(response.status).toBe(200);
  });
});
