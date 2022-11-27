import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should authenticate an user correctly", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should not allow an user authenticate with wrong credentials", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "wrong-user@email.com",
      password: "wrong-password",
    });

    expect(response.status).toBe(401);
  });
});
