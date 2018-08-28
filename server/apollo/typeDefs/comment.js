const { gql } = require('apollo-server')

const Comment = gql`
    type Comment {
        id: ID!
        content: String
        status: String
        bubbleId: String
        userId: String
        user: User
        bubble: Bubble
    }

    extend type Query {
        getComment(id: ID!): Comment
        getComments(bubbleId: ID!): [Comment]
    }

    enum CommentStatus {
        pending
        active
        deleted
        locked
    }
`

module.exports = Comment
