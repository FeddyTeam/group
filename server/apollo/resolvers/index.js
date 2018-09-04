const { merge, isEmpty } = require('lodash')
const { User } = require('../../db')

const user = require('./user')
const bubble = require('./bubble')
const comment = require('./comments')
const news = require('./news')

module.exports = merge(user, bubble, comment, news)
