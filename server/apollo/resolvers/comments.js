const { isEmpty } = require('lodash')

const { Comment, User } = require('../../db')
const check = require('./../../lib/check')

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
            try {
                const decoded = await check({ ctx, want: 'abc_create' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@abc_create')
                }

                const _comment = await Comment.forge({
                    content,
                    bubbleId,
                    userId,
                }).save()

                return _comment.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        }
    }
}

module.exports = resolver
