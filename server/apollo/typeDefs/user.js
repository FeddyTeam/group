const { gql } = require('apollo-server')

const User = gql`
    type Query {
        getProfile: Profile
        fetchUsers: [User]
    }

    type Mutation {
        updateProfile(profile: ProfileInput!): Profile
        updatePassword(passwords: PasswordInput!): Boolean
        login(form: LoginInput): LoginResult
    }

    input LoginInput {
        username: String
        password: String
        code: Int
    }

    input PasswordInput {
        password: String!
        newPassword: String!
    }

    type LoginResult {
        token: String
        user: User
        message: String
    }

    type User {
        id: ID!
        createdAt: String
        updatedAt: String

        status: UserStatus
        username: String
        email: String
        bio: String
        name: String
        avatar: String
        birthday: String
        url: String
    }

    input UserInput {
        id: ID!

        username: String
        bio: String
        avatar: String
        name: String
        birthday: String
        url: String
    }

    type Profile {
        id: ID!
        createdAt: String
        updatedAt: String

        status: UserStatus
        username: String
        email: String
        bio: String
        name: String
        avatar: String
        birthday: String
        url: String
    }

    input ProfileInput {
        id: ID!

        name: String
        bio: String
        avatar: String
        birthday: String
        url: String
    }

    enum UserStatus {
        pending
        actived
        deleted
        locked
    }
`

module.exports = User
