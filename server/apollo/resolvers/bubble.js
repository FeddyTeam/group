const { Bubble, User } = require('../../db')

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
            if (ctx.isUnauthenticated()) {
                return null
            }

            const _bubble = await Bubble.forge({
                ...bubble,
                userId: ctx.state.user.id
            }).save()

            return _bubble.toJSON()
        },
    }
}

module.exports = resolver
