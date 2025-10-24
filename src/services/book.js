import { GraphQLError } from 'graphql';
import { Book, Author } from '../db/sequelize/models/index.js';
import { sequelize } from '../db/sequelize/db.js';
import { buildAuthorWhere, buildBookWhere } from './filters.js';

function buildBookOrder(orderBy = []) {
  if (!orderBy?.length) return [['id', 'ASC']];
  const mapField = (f) => {
    switch (f) {
      case 'ID':
        return 'id';
      case 'TITLE':
        return 'title';
      case 'AUTHOR_ID':
        return 'authorId';
      case 'PUBLISHED_DATE':
        return 'publishedDate';
      case 'CREATED_AT':
        return 'createdAt';
      case 'UPDATED_AT':
        return 'updatedAt';
      default:
        return 'id';
    }
  };
  return orderBy.map(({ field, direction }) => [
    mapField(field),
    direction || 'ASC',
  ]);
}

export const BookService = {
  async list({ limit = 20, offset = 0, filter, orderBy } = {}) {
    const where = buildBookWhere(filter);
    const order = buildBookOrder(orderBy);

    const include = [];
    if (filter?.author) {
      include.push({
        model: Author,
        as: 'author',
        where: buildAuthorWhere(filter.author),
        required: true,
        attributes: [],
      });
    }

    const { rows, count } = await Book.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      distinct: true,
    });
    return {
      nodes: rows,
      totalCount: count,
      hasNextPage: offset + rows.length < count,
    };
  },

  async get(id) {
    return Book.findByPk(id);
  },

  async create(data) {
    const author = await Author.findByPk(data.authorId);
    if (!author) {
      throw new GraphQLError('Author not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return Book.create(data);
  },

  async update(data) {
    const book = await Book.findByPk(data.id);
    if (!book) {
      throw new GraphQLError('Book now found', {
        extensions: { code: 'NOT FOUND' },
      });
    }
    Object.assign(book, data);
    await book.save();
    return book;
  },

  async delete(id) {
    return sequelize.transaction(async (t) => {
      const book = await Book.findByPk(id, { transaction: t });
      if (!book) {
        throw new GraphQLError('Book not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await book.destroy({ transaction: t });
      return true;
    });
  },
};
