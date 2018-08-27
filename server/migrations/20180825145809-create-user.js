'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            // PRIMARY DATA
            id: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            status: {
                type: Sequelize.ENUM,
                values: ['active', 'pending', 'deleted', 'locked'],
                defaultValue: 'pending',
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            // PERSONAL DATA
            slug: Sequelize.STRING,
            bio: Sequelize.STRING,
            profile: Sequelize.STRING,
            firstname: Sequelize.STRING,
            lastname: Sequelize.STRING,
            birthday: Sequelize.STRING,
            website: Sequelize.STRING,
            // OUTSIDE CONNECTIONS
            githubID: Sequelize.STRING,
            googleID: Sequelize.STRING,

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            updatedAt: Sequelize.DATE
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};
