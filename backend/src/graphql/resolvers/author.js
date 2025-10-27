export const authorResolvers = {
  Query: {
    authors: (_, args, { services }) => services.author.list(args),
    author: (_, { id }, { services }) => services.author.get(id),
  },

  Mutation: {
    createAuthor: (_, { input }, { services }) => services.author.create(input),
    updateAuthor: (_, { input }, { services }) => services.author.update(input),
    deleteAuthor: (_, { input }, { services }) =>
      services.author.delete(input.id),
  },

  Author: {
    books: (author, _, { loaders }) => loaders.booksByAuthorId.load(author.id),
  },
};
