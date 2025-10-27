import { Sequelize } from 'sequelize';
import { config } from '../../config/index.js';

export const sequelize = new Sequelize(config.db.uri, {
  dialect: 'postgres',
  logging: config.db.logging ? console.log : false,
});
