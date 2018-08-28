const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

// module.exports.schema =
module.exports = {
    schema:  makeExecutableSchema({
        typeDefs,
        resolvers,
        logger: { log: e => console.log(e) },
    }),
    resolvers
}
