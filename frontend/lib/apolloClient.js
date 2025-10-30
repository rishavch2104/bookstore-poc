import { HttpLink, InMemoryCache, ApolloClient } from '@apollo/client';
import { registerApolloClient } from '@apollo/client-integration-nextjs';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.BACKEND_GRAPHQL_URL,
    }),
  });
});
