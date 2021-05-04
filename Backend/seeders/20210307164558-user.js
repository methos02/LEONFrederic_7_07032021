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
                        email: 'no-account@groupomania.fr',
                        firstname: 'Compte',
                        lastname: 'Supprimé',
                        slug: 'compte-supprimé',
                        password: hash,
                    }
                }

                if(index === 1) {
                    return {
                        email: 'leonfrederic@gmx.fr',
                        firstname: 'Frédéric',
                        lastname: 'LEON',
                        slug: 'leon-frederic',
                        password: hash,
                        roles: '["admin","modo"]',
                    }
                }

                return {
                    email: `user${ index }@gmx.fr`,
                    firstname: index,
                    lastname: 'User',
                    slug: 'user-' + index,
                    password: hash,
                    roles: '[]',
                }
            }
        );

        await queryInterface.bulkInsert('users', users, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
