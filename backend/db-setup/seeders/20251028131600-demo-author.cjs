'use strict';

const { faker } = require('@faker-js/faker');

function generateAuthors(count = 200) {
  const authors = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const author = {
      name: faker.person.fullName(),

      bio: faker.lorem.sentences({ min: 2, max: 3 }),

      dateOfBirth: faker.date.past({ years: 125, refDate: '2005-01-01' }),

      createdAt: now,
      updatedAt: now,
    };
    authors.push(author);
  }

  return authors;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const authorsData = generateAuthors(200);

    await queryInterface.bulkInsert('authors', authorsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('authors', null, {});
  },
};
