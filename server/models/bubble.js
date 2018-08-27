'use strict';
module.exports = (sequelize, DataTypes) => {
  const Bubble = sequelize.define('Bubble', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    type: {
        type: DataTypes.ENUM,
        values: ['text', 'link', 'photo', 'file', 'html'],
        defaultValue: 'text',
    },
    status: {
        type: DataTypes.ENUM,
        values: ['private', 'group', 'public'],
        defaultValue: 'group',
    },
    text: DataTypes.STRING,
    link: DataTypes.STRING,
    data: DataTypes.JSON,
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: DataTypes.DATE
  }, {});
  Bubble.associate = function(models) {
    // associations can be defined here
    const { User, Comment } = models

    Bubble.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    })
    User.hasMany(Bubble,  {
        foreignKey: 'userId'
    })

    Comment.belongsTo(Bubble, {
        foreignKey: 'bubbleId',
    })
    Bubble.hasMany(Comment,  {
        foreignKey: 'bubbleId',
        as: 'comments',
    })
  };
  return Bubble;
};
