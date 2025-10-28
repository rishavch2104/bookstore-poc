export const authorResolvers = {
  Query: {
    authors: (_, args, { services }) => services.author.list(args),
    author: (_, { id }, { services }) => services.author.get(id),
  },

  Mutation: {
    createAuthor: (_, { input }, { services, user }) =>
      services.author.create(input, { user }),
    updateAuthor: (_, { input }, { services, user }) =>
      services.author.update(input, { user }),
    deleteAuthor: (_, { input }, { services, user }) =>
      services.author.delete(input.id, { user }),
  },

  Author: {
    books: (author, _, { loaders }) => loaders.booksByAuthorId.load(author.id),
  },
};
