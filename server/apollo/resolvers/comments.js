const { Comment } = require('../../models')

const resolver = {
    Comment: {},
    Query: {
        getComments(root, { bubbleId }, context, info) {
            const options = {
                where: {
                    bubbleId: bubbleId
                }, include: [{
                    model: User,
                    as: 'user'
                }]
            }

            return Comment.findAll(options)
        },
        getComment: (root, { id }, context, info) => Comment.findById(id, {
            include: [{
                model: User,
                as: 'user'
            }, {
                model: Comment,
                as: 'comments',
            }]
        })
    }
}

module.exports = resolver
