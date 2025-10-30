Assignment Backend API

Project Overview

This is a robust, full-featured Node.js backend built with Express and Apollo Server (GraphQL). It serves as a centralized API for managing authors, books, and user interactions, implementing a modern hybrid database architecture secured by RSA-signed JSON Web Tokens (JWTs) for authentication.

Key Features

GraphQL API Endpoint: A single, performant API exposed at /graphql.

Dual Persistence Layer:

PostgreSQL (Sequelize): Used for core relational data, managing Users, Authors, and Books.

MongoDB (Mongoose): Used for flexible, non-relational data, specifically User Reviews.

Secure Authentication: Utilizes standard JWTs signed with RSA, with built-in support for secure, optional HTTP-only cookies.

Modern Tooling: Structured with Javascript and ready for development and production environments.

Prerequisites

To run this application locally, you must have the following software installed:

Node.js (v22 or higher)

PostgreSQL database instance

MongoDB instance

Environment Configuration

All necessary configuration is loaded from environment variables. Please create a .env file in the project root to define these values.

Variable

Description

MONGODB_URI

Connection string for your MongoDB instance.

PG_DATABASE_URL

Connection URL for your PostgreSQL database (e.g., postgres://user:pass@host:port/db).

JWT_SECRET

A long, complex secret key for signing JWTs.

PORT

The port the Express server will run on (e.g., 4000).

Example .env Structure

MONGODB_URI=mongodb://localhost:27017/assignmentdb
PG_DATABASE_URL=postgres://user:password@localhost:5432/assignmentdb
JWT_SECRET=your_super_secret_rsa_key_here
PORT=4000

Installation and Running Locally

Install Dependencies:

npm install

Start Development Server:
This command initiates the server and uses nodemon to watch the src/ directory, automatically restarting on changes.

npm run dev

Build and Run for Production:

npm run build
npm start # Runs the compiled production code

Database Management (PostgreSQL/Sequelize)

This project uses sequelize-cli to manage the relational database schema and data population.

Command

Action

npm run db:migrate

Executes all pending migrations to update the database schema.

npm run db:migrate:undo

Undoes the immediately preceding migration.

npm run db:seed

Runs all seed files to populate the database with initial data.

npm run db:reset

A utility command that reverts all migrations, then re-runs all migrations and seeders. (Caution: This deletes all data)

API Access

Once the server is running, the GraphQL Playground/API endpoint is available at:

http://localhost:<PORT>/graphql
