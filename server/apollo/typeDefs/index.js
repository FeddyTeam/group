const { gql } = require('apollo-server')

const user = require('./user')
const bubble = require('./bubble')
const comment = require('./comment')

// const typeDefs = gql`
//     // type Query {}
//     // type Mutation {}
// `

module.exports = [user, bubble, comment]
