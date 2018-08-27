const bcrypt = require('bcrypt')
const uuidV4 = require('uuid/v4')
const data = require('./data')

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('Person', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */

        return queryInterface.bulkInsert('Users', [{
            id: data.uuid_of_zerook,
            username: 'zerook',
            email: 'nullaber@gmail.com',
            firstname: 'Nulla',
            lastname: 'Wu',
            profile: data.profile_of_zerook,
            slug: 'zerook',
            password: bcrypt.hashSync('abc0123', 12),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            id: data.uuid_of_bot,
            username: 'Nano',
            email: 'nano@example.com',
            firstname: 'Nano',
            lastname: '',
            slug: 'nano',
            profile: data.profile_of_bot,
            password: bcrypt.hashSync('qwerty', 12),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('Person', null, {});
        */
    }
};
