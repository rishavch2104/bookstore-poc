import { GraphQLError } from 'graphql';
import { Author, Book } from '../db/models/index.js';
import { sequelize } from '../db/sequelize.js';
import { Op } from 'sequelize';

import { buildBookWhere, buildAuthorWhere } from './filters.js';

function buildAuthorOrder(orderBy = []) {
  if (!orderBy?.length) return [['id', 'ASC']];
  const mapField = (f) => {
    switch (f) {
      case 'ID':
        return 'id';
      case 'NAME':
        return 'name';
      case 'DATE_OF_BIRTH':
        return 'dateOfBirth';
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

export const AuthorService = {
  async list({ limit = 20, offset = 0, filter, orderBy } = {}) {
    const where = buildAuthorWhere(filter);
    const order = buildAuthorOrder(orderBy);

    const include = [];
    if (filter?.books) {
      include.push({
        model: Book,
        as: 'books',
        where: buildBookWhere(filter.books),
        required: true,
        attributes: [],
      });
    }

    const { rows, count } = await Author.findAndCountAll({
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
    return Author.findByPk(id);
  },

  async create(data) {
    return Author.create(data);
  },

  async update(data) {
    const author = await Author.findByPk(data.id);
    if (!author) {
      throw new GraphQLError('Author not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    Object.assign(author, data);
    await author.save();
    return author;
  },

  async delete(id) {
    return sequelize.transaction(async (t) => {
      const author = await Author.findByPk(id, { transaction: t });
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const count = await Book.count({
        where: { authorId: id },
        transaction: t,
      });
      if (count > 0) {
        throw new GraphQLError(
          'Cannot delete author who still has active books',
          {
            extensions: { code: 'BAD_USER_INPUT' },
          }
        );
      }

      await author.destroy({ transaction: t });
      return true;
    });
  },
};
