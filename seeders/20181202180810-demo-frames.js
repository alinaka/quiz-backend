'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Frames', [{
        name: '2.jpg',
        MovieId: 2
      }, {
        name: '6.jpg',
        MovieId: 7
      }, {
        name: '7.jpg',
        MovieId: 12
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Frames', null, {});
  }
};
