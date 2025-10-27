'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false, // Set to be required
      },
      bio: {
        type: Sequelize.STRING,
        allowNull: false, // Set to be required
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false, // Set to be required
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
  async down(queryInterface, Sequelize) {
    // Note: It's best practice to use the exact table name defined in `up`.
    await queryInterface.dropTable('authors');
  },
};
