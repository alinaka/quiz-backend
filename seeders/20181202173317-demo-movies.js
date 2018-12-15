'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Movies', [{
        title: 'Кловерфилд, 10',
        internationalTitle: '10 Cloverfield Lane',
        year: 2016,
      }, {
          title: 'Тихое место',
          internationalTitle: 'A Quiet Place',
          year: 2018,
      }, {
          title: 'Оно',
          internationalTitle: 'It',
          year: 2017,
      }, {
          title: 'Дорога',
          internationalTitle: 'The Road',
          year: 2009,
      }, {
          title: 'Остров собак',
          internationalTitle: 'Isle of Dogs',
          year: 2018,
      }, {
          title: 'Труп невесты',
          internationalTitle: 'Corpse Bride',
          year: 2005,
      }, {
          title: 'Семейка монстров',
          internationalTitle: 'The Boxtrolls',
          year: 2014,
      }, {
          title: 'Кубо. Легенда о самурае',
          internationalTitle: 'Kubo and the Two Strings',
          year: 2016,
      }, {
          title: 'Убийство',
          internationalTitle: 'The Killing',
          year: 2011,
      }, {
          title: 'Очень странные дела',
          internationalTitle: 'Stranger Things',
          year: 2016,
      }, {
          title: 'ОА',
          internationalTitle: 'The OA',
          year: 2016,
      }, {
          title: 'Тьма',
          internationalTitle: 'Dark',
          year: 2017,
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Movies', null, {});
  }
};
