const { gql } = require('apollo-server')

const Bubble = gql`
    type Bubble {
        id: ID!
        createdAt: String
        updatedAt: String

        type: BubbleType
        status: BubbleStatus
        text: String
        cover: String
        link: String
        data: String
        user: User
        comments: [Comment]
    }

    type BubblePage {
        hasMore: Boolean
        bubbles: [Bubble]
    }

    input BubbleInput {
        type: BubbleType
        text: String
        data: String
    }

    extend type Query {
        getBubblesPage(skip: Int = 0, count: Int = 12): BubblePage
    }

    extend type Mutation {
        createBubble(bubble: BubbleInput!): Bubble
    }

    enum BubbleStatus {
        pending
        actived
        locked
        deleted
    }
    enum BubbleType {
        text
        embed
        photo
    }
`

module.exports = Bubble
