# User Management - Express Open API - OAS 3

User Management Microservice using Express Open Api & OAS 3.

Is only a basic implementation of a user management with the typical CRUD operations persisted in a dockerized MongoDB

### 1. Install the dependencies

Go to usermanagement-microservice folder and execute:

```shell
$ npm i
```

### 2. Start the mongo service

Go to usermanagement-infrastructure folder and execute:

```shell
$ docker-compose up -d
```

### 3. Start the Express Server

```shell
$ npm run start
```

### 4. Check the OAS 3 Documentation and test the app

use this endpoint in your browser:

http://localhost:8080/api-docs

and test the CRUD methods implemented
