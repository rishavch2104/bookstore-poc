'use strict';

// Define the name for the custom PostgreSQL ENUM type
const ROLE_ENUM = 'enum_users_role';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create the Custom ENUM Type (PostgreSQL requirement)
    await queryInterface.sequelize.query(`
      CREATE TYPE ${ROLE_ENUM} AS ENUM('admin', 'user', 'moderator');
    `);

    // 2. Create the Table using the custom ENUM type
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // 🔑 ENUM Role Definition
      role: {
        type: Sequelize.ENUM('admin', 'user', 'moderator'), // ⬅️ Sequelize data type definition
        allowNull: false,
        defaultValue: 'user',
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

  down: async (queryInterface, Sequelize) => {
    // 1. Drop the Table
    await queryInterface.dropTable('users');

    // 2. Drop the Custom ENUM Type
    await queryInterface.sequelize.query(`
      DROP TYPE ${ROLE_ENUM};
    `);
  },
};
