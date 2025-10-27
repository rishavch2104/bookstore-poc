'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('books', {
      // Ensure lowercase table name for PostgreSQL
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // 🔑 The Foreign Key Column Definition
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Optional, but common for FKs
        references: {
          model: 'authors', // ⬅️ The name of the target table (must match its actual name in the DB)
          key: 'id', // ⬅️ The name of the primary key in the target table
        },
        onUpdate: 'CASCADE', // ⬅️ What happens on update (e.g., CASCADE, RESTRICT)
        onDelete: 'NO ACTION', // ⬅️ What happens on delete (e.g., NO ACTION, CASCADE, SET NULL)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  // The down function should reverse the action
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('books');
  },
};
