'use strict';
const bcrypt = require('bcrypt');
const faker = require('faker');
const { NB_USERS } = require('../config/seederConfig');
const {addWeek} = require("../helpers/dateHelper");

module.exports = {
    up: async (queryInterface) => {
        const hash = await bcrypt.hash('123123', 10).catch(error => console.log(error));
        faker.locale = 'fr';

        const users = [
            ...Array(NB_USERS)].map((value, index) => {
                if(index === 0) {
                    return {
                        email: 'leonfrederic@gmx.fr',
                        firstname: 'Frédéric',
                        lastname: 'LEON',
                        slug: 'leon-frederic',
                        password: hash,
                        roles: '["admin","modo"]',
                    }
                }

                const lastname = faker.name.lastName();
                const firstname = faker.name.firstName().toUpperCase();

                if(index === 1) {
                    return {
                        email: 'ban-user@gmx.fr',
                        firstname: firstname,
                        lastname: lastname,
                        slug: lastname.toLowerCase() + '-' + firstname.toLowerCase(),
                        password: hash,
                        banUntil: addWeek(new Date()),
                    }
                }

                return {
                    email: `user${ index }@gmx.fr`,
                    firstname: firstname,
                    lastname: lastname,
                    slug: lastname.toLowerCase() + '-' + firstname.toLowerCase(),
                    password: hash,
                }
            }
        );

        await queryInterface.bulkInsert('users', users, {});
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete('users', null, {});
    }
};
