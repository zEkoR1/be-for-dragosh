<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


# 📘 SECURE CLOUD STORAGE API

[![NestJS](https://img.shields.io/badge/NestJS-v9.0.0-red)](https://nestjs.com/)  
[![Node.js](https://img.shields.io/badge/Node.js-v18.0.0-green)](https://nodejs.org/)  
[![Prisma](https://img.shields.io/badge/Prisma-v4.0.0-blue)](https://www.prisma.io/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-v4.9.0-blue)](https://www.typescriptlang.org/)

A production-grade REST API for user management, built with NestJS, Prisma, and JWT authentication.  
Administrators can manage all users, while regular users may view or modify only their own profile. Features include:

- **JWT Authentication** via `/auth/token`
- **Role-based Authorization** (admin vs. owner)
- **CRUD operations** for User resources
- **Pagination** support for listing users
- **Secure password hashing** with bcrypt

---

## 🌟 Features

1. **Authentication & Authorization**
    - **`/auth/token`**: Issue a signed JWT to a valid user (email/username + password).
    - **`JwtAuthGuard`**: Protects routes by verifying JWT in the `Authorization: Bearer ...` header.
    - **`AdminGuard`**: Grants access only if `user.isAdmin === true`.
    - **`AdminOrOwnerGuard`**: Allows admins to access any user, while regular users can access only their own profile.

2. **User Management**
    - **Create**: Register a new user (username, email, password, optional `names`, `isAdmin`).
    - **Read (All)**: Admin-only endpoint to list users with pagination.
    - **Read (Single)**: Admins or the user themselves can fetch a single profile by ID.
    - **Update**: Admins can update any user; regular users can update only their own profile.
    - **Delete**: Admins can delete any user; regular users can delete only their own account.

3. **Pagination**
    - Supports offset-based pagination on the “list all users” route:
        - Query parameters: `page` (1-based) and `limit` (items per page).
        - Response includes `data`, `total`, `page`, `limit`, and `offset`.

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL, MySQL, SQLite, etc.)
- **Database**: Your choice (PostgreSQL recommended)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [JSON Web Tokens](https://jwt.io/) (via `@nestjs/jwt`)
- **Encryption**: [bcrypt](https://github.com/kelektiv/node.bcrypt.js) for password hashing
- **Validation**: [`class-validator`](https://github.com/typestack/class-validator) & [`class-transformer`](https://github.com/typestack/class-transformer)
- **API Documentation**: [Swagger](https://swagger.io/) (auto-generated via `@nestjs/swagger`)

---
