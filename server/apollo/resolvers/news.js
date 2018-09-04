const { News, User, knex } = require('../../db')
const _ = require('lodash')

const _fetchNews = async ({ types, type, skip = 0, count = 32 }) => {

    let options = {}
    if (!_.isEmpty(type)) {
        options = { type }
    } else if (!_.isEmpty(types)) {
        options = { type: types }
    }

    const _news = await News
        .where(options)
        .query(qb => qb.offset(skip).limit(count))
        .orderBy('-createdAt')
        .fetchAll({
            withRelated: ['user']
        })

    const news = _news.toJSON()

    return {
        hasMore: news.length === count,
        news,
        error: null,
        message: 'ok'
    }
}

const resolver = {
    News: {
        async user({ userId, user }) {
            if (user) {
                return user
            }

            const _user = await User.where('id', userId).fetch()
            return _user.toJSON()
        }
    },
    Query: {
        async fetchPublicNews(root, { types, skip, count }, ctx, info) {
            return await _fetchNews({
                types, skip, count
            })
        },
        async fetchNews(root, { types, skip, count }, ctx, info) {
            return await _fetchNews({
                types, skip, count
            })
        },
        async fetchTypedNews(root, { type, skip, count }, ctx, info) {
            return await _fetchNews({
                type, skip, count
            })
        }
    },
    Mutation: {
        async createNews(root, { news }, ctx, info) {
            const { id } = await check({ ctx, want: 'cms_create' })
            if (isEmpty(id)) {
                throw new Error('401@cms_create')
            }

            const _news = await News.forge({
                ...news,
                userId: id
            }).save()

            return _news.toJSON()
        },
        async deleteNews(root, { ids }, ctx, info) {
            const { id } = await check({ ctx, want: 'cms_delete' })
            if (isEmpty(id)) {
                throw new Error('401@cms_create')
            }

            const userId = ctx.state.user.id
            const _news = await News
                .whereIn('id', ids)
                .where({ userId })
                .fetch()

            if (_.isEmpty) {
                return 0
            }

            await _news.set({ status: 'deleted' }).save()

            console.info(_news, 'item(s) deleted.')

            return 10086
        },
        async permanentlyDeleteNews(root, { ids }, ctx, info) {
            const { id } = await check({ ctx, want: 'cms_delete' })
            if (isEmpty(id)) {
                throw new Error('401@cms_create')
            }

            const userId = ctx.state.user.id
            const _news = await knex('news')
                .whereIn('id', ids)
                .where({ userId })
                .del()

            return _news
        },
        async updateNews(root, { news }, ctx, info) {
            const { id } = await check({ ctx, want: 'cms_update' })
            if (isEmpty(id)) {
                throw new Error('401@cms_create')
            }

            const userId = ctx.state.user.id
            const id = news.id

            const _news = await News
                .where({ id, userId })
                .fetch()

            if (_.isEmpty) {
                return null
            }

            const {
                title, altTitle, content, link,
                image, altImage, thumbnail,
                color, icon, level, weight,
                activedAt, expiredAt, data, status
            } = news

            await _news.set({
                title, altTitle, content, link,
                image, altImage, thumbnail,
                color, icon, level, weight,
                activedAt, expiredAt, data, status
            }).save()

            return _news.toJSON()
        }
    }
}

module.exports = resolver
