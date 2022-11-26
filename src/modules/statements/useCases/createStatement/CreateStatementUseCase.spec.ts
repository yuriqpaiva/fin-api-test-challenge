import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { GetBalanceUseCase } from "./../getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {
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

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should be possible to create a deposit statement", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
    });

    const infos = await authenticateUserUseCase.execute({
      email: "john@example.com",
      password: "123456",
    });

    await createStatementUseCase.execute({
      amount: 1000,
      user_id: infos.user.id as string,
      description: "Test description",
      type: OperationType.DEPOSIT,
    });

    const balance = await getBalanceUseCase.execute({
      user_id: infos.user.id as string,
    });

    expect(balance.statement).toHaveLength(1);
    expect(balance.statement[0].amount).toEqual(1000);
    expect(balance.statement[0].description).toEqual("Test description");
  });
});
