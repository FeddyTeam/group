const { User } = require('../../db')

const resolvers = {
    User: {

    },
    Query: {
        async getProfile(root, _, ctx, info) {
            if (ctx.isUnauthenticated()) {
                return null
            }

            const id = ctx.state.user.id
            const results = await User
                .where('id', id)
                .where('status', 'actived')
                .fetch()

            return results.toJSON()
        }
    },
    Mutation: {
        async updateProfile(root, { profile }, ctx, info) {
            if (ctx.isUnauthenticated()) {
                return null
            }

            const { name, url, bio } = profile
            const birthday = new Date(profile.birthday)
            const id = ctx.state.user.id
            const _user = await User
                .where('id', id)
                .fetch()

            await _user.set({
                name, url, bio, birthday
            }).save()

            return _user.toJSON()
        }
    }
}

module.exports = resolvers
