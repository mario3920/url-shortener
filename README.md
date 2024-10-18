## Description

This project was made using NestJs, TypeORM and Mysql to make possible for people to make them links shortener and can inspect how much clicks they have

## Documentation

```bash
localhost/api
```

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

## .Env example without Docker

```bash
DATABASE_USERNAME = 'root'
DATABASE_PASSWORD = 'yourPassword'
DATABASE_HOST = 'localhost'
DATABASE_NAME = 'yourbaseName'
DATABASE_PORT = 'port'
JWT_SECRET_KEY = "secret"
API_URL = "urlForShortenedLinks"
PORT = 80
```

## Project setup (with docker)

```bash
$ docker compose up
```

## .Env example with Docker

```bash
DATABASE_USERNAME = 'root'
DATABASE_PASSWORD = '12345678'
DATABASE_HOST = 'db'
DATABASE_NAME = 'test'
DATABASE_PORT = '3306'
JWT_SECRET_KEY = "secret"
API_URL = "urlForShortenedLinks"
PORT = 80
```

## Resources

- NestJs
- TypeORM
- Mysql