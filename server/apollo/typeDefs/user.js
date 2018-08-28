const { gql } = require('apollo-server')

const User = gql`
    type User {
        id: ID!
        status: UserStatus
        username: String
        profile: String
    }

    enum UserStatus {
        pending
        active
        deleted
        locked
    }

    type Query {
        getUser(id: ID!): User
    }

    type Mutation {
        fakeCreateUser(email: String): User
    }
`

module.exports = User
