const uuidV4 = require('uuid/v4')
const {
    uuid_of_zerook,
    uuid_of_bot,
    uuid_of_bubble_a,
    uuid_of_bubble_b,
    uuid_of_bubble_c
} = require('./data')

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
        return queryInterface.bulkInsert('Comments', [{
            id: uuidV4(),
            content: 'WOW!',
            status: 'active',
            userId: uuid_of_bot,
            bubbleId: uuid_of_bubble_a,
            createdAt: new Date(2018, 7, 20, 16, 15, 20),
            updatedAt: new Date(),
        }, {
            id: uuidV4(),
            content: 'TESTING',
            userId: uuid_of_zerook,
            bubbleId: uuid_of_bubble_b,
            createdAt: new Date(2018, 7, 20, 17, 21, 20),
            updatedAt: new Date(),
        }, {
            id: uuidV4(),
            content: 'Styles Powered by Wing!',
            userId: uuid_of_zerook,
            bubbleId: uuid_of_bubble_b,
            createdAt: new Date(2018, 7, 22, 10, 15, 20),
            updatedAt: new Date(),
        }], {});
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
