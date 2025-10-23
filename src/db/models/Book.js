import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export class Book extends Model {}

Book.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    publishedYear: { type: DataTypes.INTEGER },
    genre: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
  }
);
