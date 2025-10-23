import { GraphQLError } from 'graphql';
import { Author, Book } from '../db/models/index.js';
import { sequelize } from '../db/sequelize.js';

export const AuthorService = {
  async list() {
    return Author.findAll();
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
