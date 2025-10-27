import { sequelize } from '../db/sequelize/db.js';
import { mongo } from '../db/mongodb/db.js';
import { Review } from '../db/mongodb/models/Review.js';
import { Author, Book, User } from '../db/sequelize/models/index.js';
import { buildLoaders } from './loader.js';
import { makeAuthorService } from '../services/author.js';
import { makeReviewService } from '../services/review.js';
import { makeBookService } from '../services/book.js';
import { makeUserService } from '../services/user.js';

export function buildContext() {
  const models = { Author, Book, User, Review, sequelize, mongo };

  return {
    db: models,
    loaders: buildLoaders(models),
    services: {
      author: makeAuthorService(models),
      review: makeReviewService(models),
      book: makeBookService(models),
      user: makeUserService(models),
    },
  };
}
