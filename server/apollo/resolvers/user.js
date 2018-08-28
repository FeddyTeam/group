const { User } = require('../../models')

const resolvers = {
    User: {

    },
    Query: {
        getUser(root, { id }, context, info) {
            return User.findById(id)
        },
    },
    Mutation: {
        fakeCreateUser(root, {id}, context, info) {
            return null
        }
    }
}

module.exports = resolvers
