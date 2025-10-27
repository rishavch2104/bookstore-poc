'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // Add the new columns in the 'up' function
  async up(queryInterface, Sequelize) {
    // 1. Add the 'description' column
    await queryInterface.addColumn('books', 'description', {
      type: Sequelize.STRING,
      allowNull: false, // Mandating a description is required
    });

    // 2. Add the 'publishedDate' column
    await queryInterface.addColumn('books', 'publishedDate', {
      type: Sequelize.DATE,
      allowNull: false, // Mandating a published date is required
    });
  },

  // Remove the columns in the 'down' function to reverse the migration
  async down(queryInterface, Sequelize) {
    // Note: It's good practice to reverse the additions in the opposite order
    await queryInterface.removeColumn('books', 'publishedDate');
    await queryInterface.removeColumn('books', 'description');
  },
};
