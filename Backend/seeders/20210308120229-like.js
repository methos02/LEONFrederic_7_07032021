'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('likes', [{
      like: 1,
      UserId: 2,
      PostId: 1
    }], {});

  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('likes', null, {});
  }
};
