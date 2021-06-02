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
            ...Array(NB_USERS + 1)].map((value, index) => {
                if(index === 0) {
                    return {
                        email: 'admin@groupomania.com',
                        firstname: 'Frédéric',
                        lastname: 'LEON',
                        slug: 'leon-frederic',
                        password: hash,
                        roles: '["admin","modo"]',
                    }
                }

                const lastname = faker.name.lastName();
                const firstname = faker.name.firstName().toUpperCase();

                if(index === NB_USERS + 1) {
                    return {
                        email: 'ban-user@groupomania.com',
                        firstname: firstname,
                        lastname: lastname,
                        slug: lastname.toLowerCase() + '-' + firstname.toLowerCase(),
                        password: hash,
                        banUntil: addWeek(new Date()),
                    }
                }

                return {
                    email: `user${ index }@groupomania.com`,
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
