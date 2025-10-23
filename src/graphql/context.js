import { sequelize } from '../db/sequelize.js';
import { Author, Book } from '../db/models/index.js';
import { buildLoaders } from './loader.js';

export function buildContext() {
  return {
    db: { sequelize, Author, Book },
    loaders: buildLoaders({ Author, Book }),
  };
}
