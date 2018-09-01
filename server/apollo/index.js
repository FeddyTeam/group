const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

module.exports = {
    schema:  makeExecutableSchema({
        typeDefs,
        resolvers,
    }),
    resolvers,
    logger: { log: e => console.log(e) },
    context: ({ ctx }) => {
        return ctx
    }
}
