import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import "reflect-metadata";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
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
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
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

    const infos = await authenticateUserUseCase.execute({
      email: "john@example.com",
      password: "123456",
    });

    const user = await showUserProfileUseCase.execute(
      infos.user.id as string
    );

    expect(user).toHaveProperty("id");
  });
});
