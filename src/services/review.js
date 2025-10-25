import { GraphQLError } from 'graphql';

export function makeReviewService({ Review, Book, User }) {
  return {
    async listByBook({ bookId, limit = 10, offset = 0 }) {
      const [nodes, totalCount] = await Promise.all([
        Review.find({ bookId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean(),
        Review.countDocuments({ bookId }),
      ]);
      return {
        nodes,
        totalCount,
        hasNextPage: offset + nodes.length < totalCount,
      };
    },

    async getSummary(bookId) {
      const agg = await Review.aggregate([
        { $match: { bookId } },
        { $group: { _id: null, count: { $sum: 1 }, sum: { $sum: '$rating' } } },
      ]);
      const { count = 0, sum = 0 } = agg[0] || {};
      const average = count ? sum / count : 0;
      return { count, average };
    },

    async create(
      { bookId, userId, rating, title, body },
      { transaction, mongoSession } = {}
    ) {
      const [book, user] = await Promise.all([
        Book.findByPk(bookId, { transaction }),
        User.findByPk(userId, { transaction }),
      ]);
      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      if (!user) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      if (rating < 1 || rating > 5) {
        throw new GraphQLError('Rating must be between 1 and 5', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      try {
        const doc = await Review.create(
          [{ bookId, userId, rating, title, body }],
          { session: mongoSession }
        );

        return doc[0].toObject();
      } catch (err) {
        if (err?.code === 11000) {
          throw new GraphQLError('User already reviewed this book', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        throw err;
      }
    },

    async update({ id, rating, title, body }, { mongoSession } = {}) {
      const patch = {};
      if (rating != null) {
        if (rating < 1 || rating > 5) {
          throw new GraphQLError('Rating must be between 1 and 5', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }
        patch.rating = rating;
      }
      if (title != null) patch.title = title;
      if (body != null) patch.body = body;

      const updated = await Review.findByIdAndUpdate(id, patch, {
        new: true,
        lean: true,
        session: mongoSession,
      });

      if (!updated) {
        throw new GraphQLError('Review not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return updated;
    },

    async delete(id, { mongoSession } = {}) {
      const res = await Review.findByIdAndDelete(id, { session: mongoSession });
      if (!res) {
        throw new GraphQLError('Review not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return true;
    },

    async deleteByBookId(bookId, { mongoSession } = {}) {
      await Review.deleteMany({ bookId }, { session: mongoSession });
    },
  };
}
