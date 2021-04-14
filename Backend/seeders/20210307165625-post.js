'use strict';
const typePost = require('../helpers/postType');
const faker = require('faker');

const articles = [...Array(10)].map(() => ({
        title: faker.lorem.words(10),
        content: faker.lorem.paragraphs(8),
        UserId: 1,
        type: typePost.ARTICLE.id
    }
));

const images = [...Array(10)].map(() => ({
        content: faker.lorem.words(10),
        image: 'post_3.webp',
        UserId: 1,
        type: typePost.IMAGE.id
    }
))

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('posts', shuffle([...articles, ...images]), {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('posts', null, {});
    }
};

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
