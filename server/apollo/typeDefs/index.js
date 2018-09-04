const { gql } = require('apollo-server')

const user = require('./user')
const bubble = require('./bubble')
const comment = require('./comment')
const news = require('./news')

module.exports = [user, bubble, comment, news]

