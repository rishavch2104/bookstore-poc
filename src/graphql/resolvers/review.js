import { ReviewService } from '../../services/review.js';
import { User } from '../../db/sequelize/user.js';

export const reviewResolvers = {
  Query: {
    reviews: (_, { bookId, limit, offset }) =>
      ReviewService.listByBook({ bookId, limit, offset }),
  },

  Mutation: {
    createReview: (_, { input }) => ReviewService.create(input),
    updateReview: (_, { input }) => ReviewService.update(input),
    deleteReview: (_, { input }) => ReviewService.delete(input.id),
  },

  Review: {
    user: (review, _, { loaders }) => {
      // You can add a DataLoader for users; simple POC uses direct lookup:
      return User.findByPk(review.userId);
    },
  },
};

// Extend Book resolver fields
export const bookReviewResolvers = {
  Book: {
    ratingSummary: (book) => ReviewService.getSummary(book.id),
    reviews: (book, { limit, offset }) =>
      ReviewService.listByBook({ bookId: book.id, limit, offset }),
  },
};
