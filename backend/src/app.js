import express, { json } from 'express';
import cors from 'cors';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typdefs/index.js';
import { resolvers } from './graphql/resolvers/index.js';
import { formatError } from './graphql/utils/errorFormatter.js';
import { buildContext } from './graphql/context.js';
import { initModels } from './db/sequelize/models/index.js';

import { ApolloServer } from '@apollo/server';

export async function createApp() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers, formatError });
  initModels();

  await server.start();
  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, { context: buildContext })
  );

  app.get('/health', (_, res) => res.send('ok'));
  return app;
}
