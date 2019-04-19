# SEN Backend

## For Development

- You need Node & Yarn to run this application. Download them here - [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com).

- You will need to set the database host url in a new .env file to the url you are hosting the database server on.

- An example .env file will look like this:

  ```bash
  PORT=5000
  TEST_DB_ADDRESS="<Your Test DB Address here>"
  DB_ADDRESS="<Your DB Address here>"
  ```

- To run the server run the following commands in the directory of sen-backend:

  - For Windows

    ```bash
    yarn
    yarn dev-win
    ```

  - For Unix based systems

    ```bash
    yarn
    yarn dev-unix
    ```

- To run tests:

  ```bash
  yarn
  yarn test
  ```
