'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Comments', {
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            type: {
                type: Sequelize.ENUM,
                values: ['bubble'],
                defaultValue: 'bubble',
            },
            status: {
                type: Sequelize.ENUM,
                values: ['pending', 'active', 'deleted', 'locked'],
                defaultValue: 'active',
            },
            content: {
                type: Sequelize.STRING,
                allowNull: false
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false
            },
            bubbleId: {
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
        return queryInterface.dropTable('Comments');
    }
};
