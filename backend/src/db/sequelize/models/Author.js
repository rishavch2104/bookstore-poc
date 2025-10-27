import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db.js';

export class Author extends Model {}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    bio: { type: DataTypes.TEXT },
    dateOfBirth: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Author',
    tableName: 'authors',
  }
);
