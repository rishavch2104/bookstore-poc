export const reviewResolvers = {
  Query: {
    reviews: (_, { bookId, limit, offset }, { services }) =>
      services.review.listByBook({ bookId, limit, offset }),
  },

  Mutation: {
    createReview: (_, { input }, { services, user }) =>
      services.review.create(input, { user }),
    updateReview: (_, { input }, { services, user }) =>
      services.review.update(input, { user }),
    deleteReview: (_, { input }, { services, user }) =>
      services.review.delete(input.id, { user }),
  },

  Review: {
    id: (review) => review._id?.toString?.() ?? review.id,
    user: (review, _, { loaders }) => loaders.userById.load(review.userId),
  },
};
