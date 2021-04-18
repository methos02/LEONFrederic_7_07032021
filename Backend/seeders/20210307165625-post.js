'use strict';
const typePost = require('../helpers/postType');
const faker = require('faker');
const { NB_ARTICLE, NB_IMAGE, NB_USERS } = require('../config/seederConfig');
const { getRandomInt } = require('../helpers/mathHelper')

module.exports = {
    up: async (queryInterface) => {
        const articles = [...Array(NB_ARTICLE)].map(() => ({
                title: faker.lorem.words(10),
                content: faker.lorem.paragraphs(8),
                UserId: getRandomInt(1, NB_USERS),
                type: typePost.ARTICLE.id
            }
        ));

        const images = [...Array(NB_IMAGE)].map(() => ({
                content: faker.lorem.words(10),
                image: 'post_3.webp',
                UserId: getRandomInt(1, NB_USERS),
                type: typePost.IMAGE.id
            }
        ));

        await queryInterface.bulkInsert('posts', shuffle([...articles, ...images]), {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('posts', null, {});
    }
};

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
