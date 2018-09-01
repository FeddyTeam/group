const { Comment, User } = require('../../db')

const resolver = {
    Comment: {
        async user({ userId, user }) {
            if (user) {
                return user
            }

            const _user = await User.where('id', userId).fetch()
            return _user.toJSON()
        },
    },
    Query: {
        async getComments(root, { bubbleId, skip, count }, context, info) {
            const results = await Comment
                .where('status', 'actived')
                .where('bubbleId', bubbleId)
                .query(qb => qb.offset(skip).limit(count))
                .orderBy('-createdAt')
                .fetchAll({
                    withRelated: ['user']
                })

            return results.toJSON()
        },
    },
    Mutation: {
        async createComment(root, { comment: { bubbleId, content } }, ctx, info) {
            if (ctx.isUnauthenticated()) {
                return null
            }

            const userId = ctx.state.user.id
            const _comment = await Comment.forge({
                content,
                bubbleId,
                userId,
            }).save()

            return _comment.toJSON()
        }
    }
}

module.exports = resolver
