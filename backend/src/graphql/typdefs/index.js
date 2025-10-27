import { mergeTypeDefs } from '@graphql-tools/merge';

import { commonTypeDefs } from './common.js';
import { scalarTypeDefs } from './scalars.js';

import { userTypeDefs } from './user.js';
import { authorTypeDefs } from './author.js';
import { bookTypeDefs } from './book.js';
import { reviewTypeDefs } from './review.js';

import gql from 'graphql-tag';
const rootTypeDefs = gql`
  type Query
  type Mutation
`;

export const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  commonTypeDefs,
  scalarTypeDefs,
  userTypeDefs,
  authorTypeDefs,
  bookTypeDefs,
  reviewTypeDefs,
]);
