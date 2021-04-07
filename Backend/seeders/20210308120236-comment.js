'use strict';

module.exports = {
    up: async (queryInterface) => {
        await queryInterface.bulkInsert('comments', [{
            content: 'Premier commentaire',
            UserId: 1,
            PostId: 1,
        },{
            content: 'Second commentaire',
            UserId: 2,
            PostId: 1,
            AnswerId: 1,
            ParentId: 1
        }], {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('comments', null, {});
    }
};
