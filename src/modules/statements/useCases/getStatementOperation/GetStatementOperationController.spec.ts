import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { ISessionsResponseDTO } from "../../dtos/ISessionsResponseDTO";

let connection: Connection;

let session: ISessionsResponseDTO;

describe("Get Statement Operation Controller", () => {
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

  it("should get an statement operation correctly", async () => {
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 123,
        description: "Test Description",
      })
      .set({
        Authorization: `Bearer ${session.token as string}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${depositResponse.body.id}`)
      .set({
        Authorization: `Bearer ${session.token as string}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
