import { AuthorService } from '../../services/author.js';

export const authorResolvers = {
  Query: {
    authors: (_, args) => AuthorService.list(args),
    author: (_, { id }) => AuthorService.get(id),
  },

  Mutation: {
    createAuthor: (_, { input }) => AuthorService.create(input),
    updateAuthor: (_, { input }) => AuthorService.update(input),
    deleteAuthor: (_, { input }) => AuthorService.delete(input.id),
  },

  Author: {
    books: (author, _, { loaders }) => loaders.booksByAuthorId.load(author.id),
  },
};
