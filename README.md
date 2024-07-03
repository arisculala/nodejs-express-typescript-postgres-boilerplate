# nodejs-express-typescript-postgres-boilerplate
The **nodejs-express-typescript-postgres-boilerplate** is a boilerplate project using nodejs, typescript, postgresql with default CRUD for users


## Table of Contents
* [Getting Started](https://github.com/arisculala/nodejs-express-typescript-postgres-boilerplate#getting-started)
     - [Prerequisites](https://github.com/arisculala/nodejs-express-typescript-postgres-boilerplate#prerequisites)
     - [Installation](https://github.com/arisculala/nodejs-express-typescript-postgres-boilerplate#installation)

[References](https://github.com/arisculala/nodejs-express-typescript-postgres-boilerplate#references)
 

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
* Node.js
* npm or yarn
* PostgreSQL

### Installation
1. Clone the repository
```bash
$ git clone https://github.com/arisculala/nodejs-express-typescript-postgres-boilerplate.git
```
2. Copy .env.example (Configure the service by updating the .env file with your PostgreSQL connection details)
```bash
$ cd nodejs-express-typescript-postgres-boilerplate
$ cp .env.example .env
```
3. Install dependencies
```bash
$ npm install
```
4. Initialize database
```bash
$ chmod +x src/scripts/db/initialize_db.sh
$ ./src/scripts/db/initialize_db.sh
```
4. Build the service
```bash
$ npm run build
```
5. Run the service
```bash
$ npm run start
```
6. Check service is running
```bash
localhost:3000/api/healthcheck/liveness
```
7. Using development, you can run the service
```bash
$ npm run dev
```

## References
