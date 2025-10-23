import { GraphQLError } from 'graphql';
import { Book, Author } from '../db/models/index.js';
import { sequelize } from '../db/sequelize.js';

export const BookService = {
  async list() {
    return Book.findAll();
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
