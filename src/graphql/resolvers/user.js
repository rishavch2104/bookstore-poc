export const userResolvers = {
  Query: {
    user: (_, { id }, { services }) => services.user.get(id),
  },

  Mutation: {
    createUser: (_, { input }, { services }) => services.user.create(input),
    updateUser: (_, { input }, { services }) => services.user.update(input),
    deleteUser: (_, { input }, { services }) => services.user.delete(input.id),
  },

  User: {
    reviews: (user, { limit = 10, offset = 0 }, { loaders }) =>
      loaders.reviewsByUserId({ limit, offset }).load(user.id),
  },
};
