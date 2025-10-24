import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Book extends Model {}

Book.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    publishedDate: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
  }
);
