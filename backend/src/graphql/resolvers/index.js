import { authorResolvers } from './author.js';
import { bookResolvers } from './book.js';
import { wrapQueryResolversWithNotFound } from '../utils/wrapQueries.js';
import { DateScalar } from './dateScalar.js';
import { reviewResolvers } from './review.js';
import { userResolvers } from './user.js';
import { authResolvers } from './auth.js';

const base = {
  Date: DateScalar,
  Query: {
    ...authorResolvers.Query,
    ...bookResolvers.Query,
    ...reviewResolvers.Query,
    ...userResolvers.Query,
  },
  Mutation: {
    ...authorResolvers.Mutation,
    ...bookResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...userResolvers.Mutation,
    ...authResolvers.Mutation,
  },
  Author: authorResolvers.Author,
  Book: bookResolvers.Book,
  Review: reviewResolvers.Review,
  User: userResolvers.User,
};

export const resolvers = wrapQueryResolversWithNotFound(
  base,
  ['author', 'book'],
  {
    author: ({ id }) => `Author ${id} not found`,
    book: ({ id }) => `Book ${id} not found`,
  }
);
