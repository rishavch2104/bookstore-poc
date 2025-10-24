import { sequelize } from '../db/sequelize/db.js';
import { mongo } from '../db/mongodb/db.js';
import { Author, Book } from '../db/sequelize/models/index.js';
import { buildLoaders } from './loader.js';

export function buildContext() {
  return {
    db: { sequelize, mongo, Author, Book },
    loaders: buildLoaders({ Author, Book }),
  };
}
