import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Balance Use Case", () => {
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
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("Should return user balance with correct format", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const infos = await authenticateUserUseCase.execute({
      email: "john@example.com",
      password: "123456",
    });

    const balance = await getBalanceUseCase.execute({
      user_id: infos.user.id as string,
    });

    expect(balance).toHaveProperty("statement");
    expect(balance.statement).toHaveLength(0);
    expect(balance).toHaveProperty("balance");
  });
});
