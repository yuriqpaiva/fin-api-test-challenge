import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import "reflect-metadata";
import { AppError } from "../../../../shared/errors/AppError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Use Case", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.JWT_SECRET = "senhasupersecreta123";

    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should authenticate an user correctly", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const user = await authenticateUserUseCase.execute({
      email: "john@example.com",
      password: "123456",
    });

    expect(user).toHaveProperty("token");
  });

  it("should not allow user authenticate with wrong credentials", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "John Doe",
        email: "john@example.com",
        password: "123456",
      });

      await authenticateUserUseCase.execute({
        email: "email@email.com",
        password: "1234521",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
