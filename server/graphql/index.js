const { graphql, buildSchema } = require('graphql')
const { User, Bubble, Comment } = require('../models')

const schema = buildSchema(`
    enum UserStatus {
        pending
        active
        deleted
        locked
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
    enum CommentStatus {
        pending
        active
        deleted
        locked
    }

    type User {
        id: ID!
        status: UserStatus
        username: String
        profile: String
    }
    type Bubble {
        id: ID!
        text: String
        status: BubbleStatus
        type: BubbleType
        userId: String
        user: User
    }
    type Comment {
        id: ID!
        content: String
        status: String
        bubbleId: String
        userId: String
        user: User
        bubble: Bubble
    }

    input BubbleInput {
        type: BubbleType
        text: String
        userId: ID
    }

    type Query {
        getUser(id: ID!): User
        getBubble(id: ID!, user: Boolean = false): Bubble
        getComment(id: ID!, user: Boolean = false, bubble: Boolean = false): Comment
        getBubbles(ids: [ID], user: Boolean = false): [Bubble]
        getComments(bubbleId: ID!, user: Boolean = false): [Comment]
        getMe(currentUserId: ID): User
    }
    type Mutation {
        createBubble(bubble: BubbleInput!): Bubble
    }
`)

const root = {
    createBubble({ bubble }) {
        return Bubble.create(bubble)
    },
    getMe({ currentUserId }) {
        console.info('Get Me', currentUserId)
        return User.findById(currentUserId)
    },
    getComments({ bubbleId, user }) {
        console.log(bubbleId, user)
        const options = {
            where: {
                bubbleId: bubbleId
            }, include: [
                ...user ? [{
                    model: User,
                    as: 'user'
                }] : [],
            ]
        }

        return Comment.findAll(options)
    },
    getBubbles({ ids, user }) {
        const options = {
            ...ids && {
                where: {
                    id: ids
                }
            },
            include: [
                ...user ? [{
                    model: User,
                    as: 'user'
                }] : [],
            ]
        }

        return Bubble.findAll(options)
    },
    getUser({ id }) {
        return User.findById(id)
    },
    getBubble({ id, user }) {
        const options = user && {
            include: [{
                model: User,
                as: 'user'
            }]
        }
        return Bubble.findById(id, options)
    },
    getComment({ id, user, bubble }) {
        const options = {
            include: [
                ...user ? [{
                    model: User,
                    as: 'user'
                }] : [],
                ...bubble ? [{
                    model: Comment,
                    as: 'comments',
                }] : []
            ]
        }
        return Comment.findById(id, options)
    },
}

module.exports = function (query, variables) {
    return graphql(schema, query, root, null, variables)
}
