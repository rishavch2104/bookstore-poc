import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export class Author extends Model {}

Author.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: 'Author',
    tableName: 'authors',
  }
);
