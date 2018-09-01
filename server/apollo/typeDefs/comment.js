const { gql } = require('apollo-server')

const Comment = gql`
    type Comment {
        id: ID!
        createdAt: String
        updatedAt: String

        content: String
        status: String
        userId: String
        user: User
        bubbleId: String
        bubble: Bubble
    }

    input CommentInput {
        content: String!
        bubbleId: String!
    }

    extend type Query {
        getComments(bubbleId: ID!, skip: Int = 0, count: Int = 16): [Comment]
    }

    extend type Mutation {
        createComment(comment: CommentInput!): Comment
    }

    enum CommentStatus {
        pending
        actived
        deleted
        locked
    }
`

module.exports = Comment
