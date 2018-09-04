const config = require('../knex/knexfile')[process.env.NODE_ENV || 'development']

const knex = require('knex')(config)

const bookshelf = require('bookshelf')(knex)

bookshelf.plugin(require('bookshelf-uuid'))

const User = bookshelf.Model.extend({
    tableName: 'users',
    uuid: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    bubbles() {
        return this.hasMany(Bubble, 'userId')
    }
})

const Bubble = bookshelf.Model.extend({
    tableName: 'bubbles',
    uuid: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    user() {
        return this.belongsTo(User, 'userId')
    },
    comments() {
        return this.hasMany(Comment, 'bubbleId')
    },
})

const Comment = bookshelf.Model.extend({
    tableName: 'comments',
    uuid: true,
    hasTimestamps: ['createdAt', 'updatedAt'],
    user() {
        return this.belongsTo(User, 'userId')
    },
    bubble() {
        return this.belongsTo(Bubble, 'bubbleId')
    }
})

const News = bookshelf.Model.extend({
    tableName: 'news',
    uuid: true,
    hasTimestamps: ['createdAt', 'updatedAt', 'activedAt'],
    user() {
        return this.belongsTo(User, 'userId')
    }
})

module.exports = {
    User, Bubble, Comment, News, knex
}
