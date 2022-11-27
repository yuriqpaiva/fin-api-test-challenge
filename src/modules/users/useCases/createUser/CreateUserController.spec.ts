import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(() => {
    connection.dropDatabase();
    connection.close();
  });

  it("should create a new user", async () => {
    console.log("Test!");
  });
});
