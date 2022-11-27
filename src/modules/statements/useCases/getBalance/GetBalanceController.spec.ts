import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ISessionsResponseDTO } from "../../dtos/ISessionsResponseDTO";

let connection: Connection;

let session: ISessionsResponseDTO;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "Test User",
      password: "123456",
      email: "user@email.com",
    });

    const sessionsResponse = await request(app).post("/api/v1/sessions").send({
      email: "user@email.com",
      password: "123456",
    });

    session = sessionsResponse.body;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should create a deposit statement correctly", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${session.token as string}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("statement");
    expect(response.body).toHaveProperty("balance");
  });
});
