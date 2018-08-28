const { gql } = require('apollo-server')

const Bubble = gql`
    type Bubble {
        id: ID!
        type: BubbleType
        status: BubbleStatus
        text: String
        user: User
        userID: ID
        comments: [Comment]
    }

    input BubbleInput {
        type: BubbleType
        text: String
        userId: ID
    }

    extend type Query {
        getBubble(id: ID!): Bubble,
        getBubbles: [Bubble],
    }

    extend type Mutation {
        createBubble(bubble: BubbleInput!): Bubble
    }

    enum BubbleStatus {
        private
        group
        public
    }
    enum BubbleType {
        text
        link
        photo
        file
        html
    }
`

module.exports = Bubble
