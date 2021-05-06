'use strict';
const faker = require('faker');
const { NB_COMMENTS, NB_USERS, NB_MIN_USERS, NB_IMAGES, NB_ARTICLES, NB_ANSWERS } = require('../config/seederConfig');
const Comment = require('../models').Comment;
const { getRandomInt } = require('../helpers/mathHelper');

module.exports = {
    up: async (queryInterface) => {
        faker.setLocale('fr');

        const comments = [...Array(NB_COMMENTS)].map(() => ({
                content: faker.lorem.words(10),
                UserId: getRandomInt(NB_MIN_USERS, NB_USERS),
                PostId: getRandomInt(1, NB_IMAGES + NB_ARTICLES),
            }
        ));

        await queryInterface.bulkInsert('comments', comments, {});

        const insert_comments = await Comment.findAll();
        const answers = [];
        insert_comments.map( comment => {
            answers.push([...Array(getRandomInt(0, NB_ANSWERS))].map(() => ({
                    content: faker.lorem.words(10),
                    UserId: getRandomInt(NB_MIN_USERS, NB_USERS),
                    PostId: comment.PostId,
                    ParentId: comment.id
                }
            )));
        });

        await queryInterface.bulkInsert('comments', answers.flat(), {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('comments', null, {});
    }
};
