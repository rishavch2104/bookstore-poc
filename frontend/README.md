Assignment Frontend API

Project Overview

This is a robust, full-featured nextJS frontend built with Apollo Cleint (GraphQL).

Prerequisites

To run this application locally, you must have the following software installed:

Node.js (v22 or higher)

Environment Configuration

All necessary configuration is loaded from environment variables. Please create a .env file in the project root to define these values.

Variable

Description

BACKEND_GRAPHQL_URL

Connection URL for your backend API

PORT

The port the Express server will run on (e.g., 4000).

Example .env Structure

BACKEND_GRAPHQL_URL=http://localhost:4000/graphql
PORT=4000

Installation and Running Locally

Install Dependencies:

npm install

Start Development Server:
This command initiates the client and automatically restarts on changes.

npm run dev

Build and Run for Production:

npm run build #
npm start # Runs the compiled production code
