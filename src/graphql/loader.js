import DataLoader from 'dataloader';

export function buildLoaders(db) {
  return {
    authorById: new DataLoader(async (ids) => {
      const authors = await db.Author.findAll({ where: { id: ids } });
      const map = new Map(authors.map((a) => [a.id, a]));
      return ids.map((id) => map.get(id) || null);
    }),

    booksByAuthorId: new DataLoader(async (authorIds) => {
      const books = await db.Book.findAll({ where: { authorId: authorIds } });
      return authorIds.map((id) => books.filter((b) => b.authorId === id));
    }),
  };
}
