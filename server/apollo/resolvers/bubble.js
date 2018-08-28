const { Bubble, User } = require('../../models')

const resolver = {
    Bubble: {

    },
    Query: {
        getBubbles(root, args, context, info) {
            return Bubble.findAll()
        },

        getBubble(root, { id }, context, info) {
            return Bubble.findById(id, {
                include: [{
                    model: User,
                    as: 'user'
                }]
            })
        },
    },
    Mutation: {
        createBubble(root, { bubble }, context, info) {
            return Bubble.create(bubble)
        },
    }
}

module.exports = resolver
