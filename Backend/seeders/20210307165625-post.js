'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('posts', [{
            title: 'Premier Post',
            content: 'Contenu du premier post.',
            UserId: 1,
            like: 1
        },{
            title: 'Second Post',
            content: 'Contenu du second post.',
            UserId: 1,
            like: 0
        },{
            title: 'Post John Doe',
            content: 'Contenu du post de john Doe.',
            UserId: 2,
            like: 0
        }], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('posts', null, {});
    }
};
