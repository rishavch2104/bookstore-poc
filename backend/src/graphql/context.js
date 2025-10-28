import { sequelize } from '../db/sequelize/db.js';
import { mongo } from '../db/mongodb/db.js';
import { Review } from '../db/mongodb/models/Review.js';
import { Author, Book, User } from '../db/sequelize/models/index.js';
import { buildLoaders } from './loader.js';
import { makeAuthorService } from '../services/author.js';
import { makeReviewService } from '../services/review.js';
import { makeBookService } from '../services/book.js';
import { makeUserService } from '../services/user.js';
import { makeAuthService } from '../services/auth.js';

export function buildContext({ req }) {
  const user = req.user;

  const models = { Author, Book, User, Review, sequelize, mongo };

  return {
    user,
    db: models,
    loaders: buildLoaders(models),
    services: {
      author: makeAuthorService(models),
      review: makeReviewService(models),
      book: makeBookService(models),
      user: makeUserService(models),
      auth: makeAuthService(models),
    },
  };
}
