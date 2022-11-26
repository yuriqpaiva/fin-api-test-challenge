import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get Statement Operation Use Case", () => {
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
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
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

    const createdStatement = await createStatementUseCase.execute({
      amount: 1000,
      user_id: infos.user.id as string,
      description: "Test description",
      type: OperationType.DEPOSIT,
    });

    const foundedStatement = await getStatementOperationUseCase.execute({
      user_id: infos.user.id as string,
      statement_id: createdStatement.id as string,
    });

    expect(foundedStatement.amount).toEqual(1000);
    expect(foundedStatement.description).toEqual("Test description");
  });
});
