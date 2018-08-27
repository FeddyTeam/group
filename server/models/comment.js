'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['bubble'],
            defaultValue: 'bubble',
        },
        status: {
            type: DataTypes.ENUM,
            values: ['pending', 'active', 'deleted', 'locked'],
            defaultValue: 'active',
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: DataTypes.DATE,

        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        bubbleId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {});
    Comment.associate = function (models) {
        // associations can be defined here
        const { User, Bubble } = models

        Comment.belongsTo(Bubble, {
            foreignKey: 'bubbleId'
        })
        Bubble.hasMany(Comment, {
            foreignKey: 'bubbleId'
        })

        Comment.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
        })
        User.hasMany(Comment, {
            foreignKey: 'userId'
        })
    };
    return Comment;
};
