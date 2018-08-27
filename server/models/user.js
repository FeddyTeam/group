'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        // PRIMARY DATA
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'pending', 'deleted', 'locked'],
            defaultValue: 'pending',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // PERSONAL DATA
        slug: DataTypes.STRING,
        bio: DataTypes.STRING,
        profile: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        birthday: DataTypes.STRING,
        website: DataTypes.STRING,
        // OUTSIDE CONNECTIONS
        githubID: DataTypes.STRING,
        googleID: DataTypes.STRING,

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: DataTypes.DATE
    }, {
        timestamps: true,
    });
    User.associate = function (models) {
        const { Bubble, Comment } = models

        Bubble.belongsTo(User, {
            foreignKey: 'userId'
        })
        User.hasMany(Bubble,  {
            foreignKey: 'userId'
        })

        Comment.belongsTo(User, {
            foreignKey: 'userId'
        })
        User.hasMany(Comment,  {
            foreignKey: 'userId'
        })
    };
    return User;
};
