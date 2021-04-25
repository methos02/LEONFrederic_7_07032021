'use strict';
const bcrypt = require('bcrypt');
const { NB_USERS } = require('../config/seederConfig');

module.exports = {
    up: async (queryInterface) => {
        const hash = await bcrypt.hash('123123', 10).catch(error => console.log(error));

        const users = [
            ...Array(NB_USERS)].map((value, index) => {
                if(index === 0) {
                    return {
                        email: 'leonfrederic@gmx.fr',
                        name: 'LEON Frédéric',
                        slug: 'leon-frederic',
                        password: hash,
                        isAdmin: 1,
                    }
                }

                return {
                    email: `user${ index }@gmx.fr`,
                    name: 'User ' + index,
                    slug: 'user-' + index,
                    password: hash,
                    isAdmin: 0,
                }
            }
        );

        await queryInterface.bulkInsert('users', users, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
