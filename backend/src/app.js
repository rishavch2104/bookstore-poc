import express, { json } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typdefs/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { formatError } from './graphql/utils/errorFormatter.js';
import { buildContext } from './graphql/context.js';
import { initModels } from './db/sequelize/models/index.js';

import { ApolloServer } from '@apollo/server';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  req.user = undefined;

  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      console.error('Authentication token invalid or expired:', error.message);
    }
  }
  next();
};

const app = express();

const server = new ApolloServer({ typeDefs, resolvers, formatError });
initModels();

await server.start();
app.use(
  '/graphql',
  authMiddleware,
  cors(),
  json(),
  expressMiddleware(server, { context: ({ req }) => buildContext({ req }) })
);

app.get('/health', (_, res) => res.send('ok'));
