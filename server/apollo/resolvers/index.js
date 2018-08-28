const { merge } = require('lodash')

const user = require('./user')
const bubble = require('./bubble')
const comment = require('./comments')

module.exports = merge(user, bubble, comment)
