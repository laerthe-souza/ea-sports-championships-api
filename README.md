# EA Sports FC Championship - Organization and Management

This project is an application for organizing and managing EA Sports FC championships. It allows players to register, join championships, and track their performance through detailed rounds and scoreboards.

## Features:
- **Player management**: Players can register with name, email, and password.
- **Championship creation**: Manage multiple championships with different participants.
- **Match rounds**: Players face each other in two rounds per week (home and away).
- **Result tracking**: Match results are recorded, including goals scored and whether the player played at home.
- **Scoreboard**: Track each player's progress in the championship, including wins, losses, draws, goals scored, and goals conceded.

## Technologies:
- **Prisma ORM** for database modeling.
- **NestJS** as the backend framework.
- **PostgreSQL** as the database.

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
