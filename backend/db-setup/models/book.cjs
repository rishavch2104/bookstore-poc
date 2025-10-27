'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, {
        foreignKey: 'authorId',
        onDelete: 'NO ACTION', // Matches the migration constraint
      });
    }
  }

  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false, // ⬅️ Added allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false, // ⬅️ Added allowNull: false
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false, // ⬅️ Added allowNull: false
      },
      publishedDate: {
        type: DataTypes.DATE,
        allowNull: false, // ⬅️ Added allowNull: false
      },
    },
    {
      sequelize,
      modelName: 'Book',
    }
  );
  return Book;
};
