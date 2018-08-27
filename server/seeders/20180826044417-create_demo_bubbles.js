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


        return queryInterface.bulkInsert('Bubbles', [{
            id: uuid_of_bubble_a,
            text: 'Hello World!',
            type: 'text',
            status: 'public',
            userId: uuid_of_zerook,
            createdAt: new Date(2018, 7, 20, 16, 15, 20),
            updatedAt: new Date(),
        }, {
            id: uuid_of_bubble_b,
            type: 'html',
            text: '<h1>This is GROUP!!!</h1>',
            userId: uuid_of_bot,
            createdAt: new Date(2018, 7, 20, 17, 21, 20),
            updatedAt: new Date(),
        }, {
            id: uuid_of_bubble_c,
            type: 'link',
            text: 'Styles Powered by Wing!',
            link: 'https://kbrsh.github.io/wing',
            userId: uuid_of_zerook,
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
