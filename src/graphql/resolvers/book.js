import { BookService } from '../../services/book.js';

export const bookResolvers = {
  Query: {
    books: (_, args) => BookService.list(args),
    book: (_, { id }) => BookService.get(id),
  },

  Mutation: {
    createBook: (_, { input }) => BookService.create(input),
    updateBook: (_, { input }) => BookService.update(input),
    deleteBook: (_, { input }) => BookService.delete(input.id),
  },

  Book: {
    author: (book, _, { loaders }) => loaders.authorById.load(book.authorId),
  },
};
