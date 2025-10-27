import { Author } from './Author.js';
import { Book } from './Book.js';
import { User } from './User.js';

export function initModels() {
  Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' });
  Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' });
}

export { Author, Book, User };
