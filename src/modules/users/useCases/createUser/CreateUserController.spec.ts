import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    expect(response.status).toBe(201);
  });

  it("should not allow to create a new user with an email that already exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    expect(response.status).toBe(400);
  });
});
