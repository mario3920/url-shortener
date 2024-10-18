

## Description

This project was made using NestJs, TypeORM and Mysql to make possible for people to make them links shortener and can inspect how much clicks they have

## Project setup (without docker)

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Project setup (with docker)

```bash
$ docker compose up
```

## Resources

- NestJs
- TypeORM
- Mysql

## .Env example

```bash
DATABASE_USERNAME = 'root'
DATABASE_PASSWORD = 'youtPassword'
DATABASE_HOST = 'localhost'
DATABASE_NAME = 'baseName'
DATABASE_PORT = 'port'
JWT_SECRET_KEY = "secret"
API_URL = "urlForShortenedLinks"
PORT = 3306
```