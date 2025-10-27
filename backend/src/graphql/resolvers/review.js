export const reviewResolvers = {
  Query: {
    reviews: (_, { bookId, limit, offset }, { services }) =>
      services.review.listByBook({ bookId, limit, offset }),
  },

  Mutation: {
    createReview: (_, { input }, { services }) => services.review.create(input),
    updateReview: (_, { input }, { services }) => services.review.update(input),
    deleteReview: (_, { input }, { services }) =>
      services.review.delete(input.id),
  },

  Review: {
    id: (review) => review._id?.toString?.() ?? review.id,
    user: (review, _, { loaders }) => loaders.userById.load(review.userId),
  },
};
