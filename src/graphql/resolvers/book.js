export const bookResolvers = {
  Query: {
    books: (_, args, { services }) => services.book.list(args),
    book: (_, { id }, { services }) => services.book.get(id),
  },

  Mutation: {
    createBook: (_, { input }, { services }) => services.book.create(input),
    updateBook: (_, { input }, { services }) => services.book.update(input),
    deleteBook: (_, { input }, { services }) => services.book.delete(input.id),
  },

  Book: {
    author: (book, _, { loaders }) => loaders.authorById.load(book.authorId),
    ratingSummary: (book, _, { loaders }) =>
      loaders.ratingSummaryByBookId.load(book.id),

    reviews: (book, { limit = 10, offset = 0 }, { loaders }) =>
      loaders.reviewsByBookId({ limit, offset }).load(book.id),
  },
};
