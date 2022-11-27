import { createConnection, getConnectionOptions } from "typeorm";

(async () => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      database: process.env.NODE_ENV === "test" ? "fin_api_test" : "fin_api",
    })
  );
})();
