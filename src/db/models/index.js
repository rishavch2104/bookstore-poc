import { Author } from './Author.js';
import { Book } from './Book.js';

export function initModels() {
  Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
  Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
}

export { Author, Book };
