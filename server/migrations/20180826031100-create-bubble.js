'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Bubbles', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            type: {
                type: Sequelize.ENUM,
                values: ['text', 'link', 'photo', 'file', 'html'],
                defaultValue: 'text'
            },
            status: {
                type: Sequelize.ENUM,
                values: ['private', 'group', 'public'],
                defaultValue: 'group'
            },
            text: Sequelize.STRING,
            link: Sequelize.STRING,
            data: Sequelize.JSON,
            userId: {
                type: Sequelize.UUID,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Bubbles');
    }
};
