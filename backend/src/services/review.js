import { GraphQLError } from 'graphql';
import { isLoggedIn } from './utils.js';

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
    async create(
      { bookId, rating, title, body },
      { user, transaction, mongoSession } = {}
    ) {
      isLoggedIn(user);

      const book = await Book.findByPk(bookId, { transaction });
      if (!book) {
        throw new GraphQLError('Book not found', {
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
          [{ bookId, userId: user.id, rating, title, body }],
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

    async update({ id, rating, title, body }, { user, mongoSession } = {}) {
      isLoggedIn(user);
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

    async delete(id, { user, mongoSession } = {}) {
      isLoggedIn(user);
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
