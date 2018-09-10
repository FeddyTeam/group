const { gql } = require('apollo-server')

const Utils = gql`
    extend type Mutation {
        checkRSS: Int
        mkQiniuToken: String
    }
`

module.exports = Utils
