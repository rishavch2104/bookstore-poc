import DataLoader from 'dataloader';

export function buildLoaders(services) {
  return {
    authorById: new DataLoader(async (ids) => {
      const authors = await services.Author.findAll({ where: { id: ids } });
      const map = new Map(authors.map((a) => [a.id, a]));
      return ids.map((id) => map.get(id) || null);
    }),

    booksByAuthorId: new DataLoader(async (authorIds) => {
      const books = await services.Book.findAll({
        where: { authorId: authorIds },
      });
      return authorIds.map((id) => books.filter((b) => b.authorId === id));
    }),
    userById: new DataLoader(async (ids) => {
      const users = await services.User.findAll({ where: { id: ids } });
      const map = new Map(users.map((u) => [u.id, u]));
      return ids.map((id) => map.get(id) || null);
    }),
    ratingSummaryByBookId: new DataLoader(async (bookIds) => {
      const agg = await services.Review.aggregate([
        { $match: { bookId: { $in: bookIds } } },
        {
          $group: {
            _id: '$bookId',
            count: { $sum: 1 },
            sum: { $sum: '$rating' },
          },
        },
      ]);

      const map = new Map(
        agg.map(({ _id, count, sum }) => [
          _id,
          { count, average: count ? sum / count : 0 },
        ])
      );

      return bookIds.map((id) => map.get(id) || { count: 0, average: 0 });
    }),
    reviewsByBookId: function ({
      limit = 10,
      offset = 0,
      sort = { createdAt: -1 },
    } = {}) {
      const loader = new DataLoader(async (bookIds) => {
        const results = await Promise.all(
          bookIds.map(async (bookId) => {
            const [nodes, totalCount] = await Promise.all([
              services.Review.find({ bookId })
                .sort(sort)
                .skip(offset)
                .limit(limit)
                .lean(),
              services.Review.countDocuments({ bookId }),
            ]);
            return {
              nodes,
              totalCount,
              hasNextPage: offset + nodes.length < totalCount,
            };
          })
        );
        return results;
      });
      return loader;
    },
    reviewsByUserId: function ({
      limit = 10,
      offset = 0,
      sort = { createdAt: -1 },
    } = {}) {
      const loader = new DataLoader(async (userIds) => {
        const results = await Promise.all(
          userIds.map(async (userId) => {
            const [nodes, totalCount] = await Promise.all([
              services.Review.find({ userId })
                .sort(sort)
                .skip(offset)
                .limit(limit)
                .lean(),
              services.Review.countDocuments({ userId }),
            ]);
            return {
              nodes,
              totalCount,
              hasNextPage: offset + nodes.length < totalCount,
            };
          })
        );
        return results;
      });
      return loader;
    },
  };
}
