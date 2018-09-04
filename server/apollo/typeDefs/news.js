const { gql } = require('apollo-server')

const Bubble = gql`
    type News {
        id: ID!

        type: NewsType
        status: NewsStatus
        level: NewsLevel

        content: String
        title: String
        altTitle: String
        image: String
        altImage: String
        thumbnail: String
        color: String
        link: String
        icon: String
        featured: Boolean
        weight: Int
        data: String
        user: User

        createdAt: String
        updatedAt: String
        activedAt: String
        expiredAt: String
    }

    input NewsInput {
        id: ID
        type: NewsType
        status: NewsStatus
        level: NewsLevel

        content: String
        title: String!
        altTitle: String
        image: String
        altImage: String
        thumbnail: String
        color: String
        link: String
        icon: String
        weight: Int
        data: String
        userId: ID!

        activedAt: String
        expiredAt: String
    }

    type NewsPage {
        hasMore: Boolean
        news: [News]
        error: Boolean
        message: String
    }

    extend type Query {
        fetchPublicNews(types: [NewsType], skip: Int = 0, count: Int = 32): NewsPage

        fetchNews(types: [NewsType], skip: Int = 0, count: Int = 32): NewsPage
        fetchTypedNews(type: NewsType!, skip: Int = 0, count: Int = 32): NewsPage
    }

    extend type Mutation {
        createNews(news: NewsInput!): News
        updateNews(news: NewsInput!): News
        deleteNews(ids: [ID]!): Int
        permanentlyDeleteNews(ids: [ID]!): Int
    }

    enum NewsType {
        news, project, event, post, notice, alert, story, link, ad, special
    }
    enum NewsStatus {
        draft, pending, actived, expired, deleted
    }
    enum NewsLevel {
        removed, normal, featured, mustread
    }
`

module.exports = Bubble
