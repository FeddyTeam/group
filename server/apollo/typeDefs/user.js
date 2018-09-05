const { gql } = require('apollo-server')

const User = gql`
    type Query {
        getProfile: Profile
        fetchUsers: [User]
        fetchUser(id: ID!): User
    }

    type Mutation {
        updateProfile(profile: ProfileInput!): Profile
        updatePassword(passwords: PasswordInput!): Boolean
        login(form: LoginInput): LoginResult
        createUser(user: UserInput!): User
        updateUser(user: UserUpdateInput!): User
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
        adm: Boolean
        cms: Boolean
        abc: Boolean
    }

    input UserInput {
        email: String!
        password: String!
        username: String
    }

    input UserUpdateInput {
        id: ID!
        username: String
        email: String
        name: String
        password: String
        status: UserStatus
        adm: Boolean
        cms: Boolean
        abc: Boolean
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
        adm: Boolean
        cms: Boolean
        abc: Boolean
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
