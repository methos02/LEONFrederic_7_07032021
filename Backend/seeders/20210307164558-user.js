'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface) => {
        const hash = await bcrypt.hash('123123', 10).catch(error => res.status(500).json({ error }));

        await queryInterface.bulkInsert('users', [{
            email: 'leonfrederic@gmx.fr',
            name: 'LEON Frédéric',
            password: hash,
            isAdmin: 1,
        },{
            email: 'johndoe@gmx.fr',
            name: 'DOE John',
            password: hash,
            isAdmin: 0,
        }], {});
    },

    down: async (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
