'use strict';
const faker = require('faker');
const { NB_COMMENTS, NB_USERS, NB_IMAGES, NB_ARTICLES } = require('../config/seederConfig');
const { getRandomInt } = require('../helpers/mathHelper');

module.exports = {
    up: async (queryInterface) => {
        const comments = [...Array(NB_COMMENTS)].map(() => ({
                content: faker.lorem.words(10),
                UserId: getRandomInt(1, NB_USERS),
                PostId: getRandomInt(1, NB_IMAGES + NB_ARTICLES),
            }
        ));

        await queryInterface.bulkInsert('comments', comments, {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('comments', null, {});
    }
};
