<p align="center" style="width: 100%; max-width: 800px; margin: -15px auto; 0">
  This project is responsible for management EA Sports FC championships.
</p>

## Tools to running this project

- [Docker](https://www.docker.com/get-started)
- [Docker compose](https://docs.docker.com/compose)
- [Visual Studio Code](https://code.visualstudio.com)

## Installation

1. Install the following extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) in your Visual Studio Code.
2. Press `CTRL + SHIFT + P` on your keyboard to open VS Code command palette, then search for this option `Dev Containers: Rebuild and Reopen in Container` and press Enter.

## Running the app

1. Inside the VS Code container, update your .env file by replacing all `localhost` occurrences with your machine's IP address.
2. Run PostgreSQL and RabbitMQ with docker
    - PostgreSQL: `docker run --name postgres -p 5432:5432 -e POSTGRES_USER=docker -e POSTGRES_PASSWORD=docker -d postgres`
3. Now, run `yarn start:dev` in your VS Code integrated terminal.
