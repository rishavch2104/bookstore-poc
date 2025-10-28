'use strict';

const { faker } = require('@faker-js/faker');
// Import your Author model so we can query existing IDs
const { Author } = require('../../src/db/sequelize/models/Author.js'); // Adjust path as necessary

/**
 * Generates an array of book objects.
 * @param {number} count The number of book records to generate (1000).
 * @param {Array<number>} authorIds An array of existing author IDs.
 * @returns {Array<object>} An array of book objects.
 */
function generateBooks(count, authorIds) {
  const books = [];
  const now = new Date();

  // Guard against an empty author list
  if (authorIds.length === 0) {
    console.error('No Author IDs found. Cannot seed books.');
    return [];
  }

  for (let i = 0; i < count; i++) {
    // 1. Get a random authorId from the fetched list
    const randomIndex = Math.floor(Math.random() * authorIds.length);
    const randomAuthorId = authorIds[randomIndex];

    const book = {
      // Generate a compelling book title
      title:
        faker.lorem.words({ min: 2, max: 5 }) +
        ' ' +
        faker.helpers.arrayElement([
          'Chronicles',
          'Mystery',
          'Tale',
          'Journey',
          'Legacy',
        ]),

      // Generate a detailed description
      description: faker.lorem.paragraph({ min: 2, max: 3 }),

      // Assign the random author ID
      authorId: randomAuthorId,

      // Generate a published date between 1950 and 2025
      publishedDate: faker.date.past({ years: 75, refDate: '2025-01-01' }),

      createdAt: now,
      updatedAt: now,
    };
    books.push(book);
  }

  return books;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Fetch ALL existing Author IDs
    // We use raw query because the context might not allow direct model access
    const authors = await queryInterface.sequelize.query(
      `SELECT id FROM authors;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // 2. Map the results to a simple array of IDs
    const authorIds = authors.map((author) => author.id);

    // 3. Generate 1000 book records with random author IDs
    const booksData = generateBooks(1000, authorIds);

    // 4. Bulk insert the 1000 book records into the 'books' table
    await queryInterface.bulkInsert('books', booksData, {});
  },

  async down(queryInterface, Sequelize) {
    // Delete all records from the 'books' table
    await queryInterface.bulkDelete('books', null, {});
  },
};
