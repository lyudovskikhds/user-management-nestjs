## Installation

```bash
$ yarn install
```

## Postgres Deployment

To deploy Postgres DB run this command from repository root:

```bash
$ docker-compose up -d
```

To stop container run:

```bash
$ docker-compose down
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

