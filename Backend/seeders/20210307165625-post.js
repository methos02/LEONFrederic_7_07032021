'use strict';
const typePost = require('../helpers/postType');
const faker = require('faker');
const { NB_ARTICLES, NB_IMAGES, NB_USERS, NB_MIN_USERS } = require('../config/seederConfig');
const { getRandomInt } = require('../helpers/mathHelper');

module.exports = {
    up: async (queryInterface) => {
        const articles = [...Array(NB_ARTICLES)].map(() =>{
            const name = faker.lorem.words(10);
            return {
                title: name,
                slug: name.replace(/\s+/g, '-').toLowerCase(),
                content: faker.lorem.paragraphs(8),
                UserId: getRandomInt(NB_MIN_USERS, NB_USERS),
                type: typePost.ARTICLE.id
            }
        });

        const images = [...Array(NB_IMAGES)].map(() => ({
                content: faker.lorem.words(10),
                image: 'post_3.webp',
                UserId: getRandomInt(NB_MIN_USERS, NB_USERS),
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
