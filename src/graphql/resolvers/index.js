import { authorResolvers } from './author.js';
import { bookResolvers } from './book.js';
import { wrapQueryResolversWithNotFound } from '../utils/wrapQueries.js';
import { DateScalar } from './dateScalar.js';

const base = {
  Date: DateScalar,
  Query: {
    ...authorResolvers.Query,
    ...bookResolvers.Query,
  },
  Mutation: {
    ...authorResolvers.Mutation,
    ...bookResolvers.Mutation,
  },
  Author: authorResolvers.Author,
  Book: bookResolvers.Book,
};

export const resolvers = wrapQueryResolversWithNotFound(
  base,
  ['author', 'book'],
  {
    author: ({ id }) => `Author ${id} not found`,
    book: ({ id }) => `Book ${id} not found`,
  }
);
