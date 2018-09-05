const { isEmpty } = require('lodash')

const { Bubble, User } = require('../../db')
const check = require('./../../lib/check')

const resolver = {
    Bubble: {
        async user({ userId, user }) {
            if (user) {
                return user
            }

            const _user = await User.where('id', userId).fetch()
            return _user.toJSON()
        },
        comments(bubble) {
            return bubble.comments || [] // for new created
        }
    },
    Query: {
        async getBubblesPage(root, { skip, count }, ctx, info) {
            const results = await Bubble
                .where('status', 'actived')
                .query(qb => qb.offset(skip).limit(count))
                .orderBy('-createdAt')
                .fetchAll({
                    withRelated: ['user', 'comments']
                })

            const bubbles = results.toJSON()

            return {
                hasMore: bubbles.length == count,
                bubbles
            }
        },
    },
    Mutation: {
        async createBubble(root, { bubble }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'abc_create' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@abc_create')
                }

                const _bubble = await Bubble.forge({
                    ...bubble,
                    userId
                }).save()

                return _bubble.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },
    }
}

module.exports = resolver
