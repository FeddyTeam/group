const { isEmpty } = require('lodash')
const { News, User, knex } = require('../../db')
const check = require('./../../lib/check')

const _fetchNews = async ({ types, type, skip = 0, count = 32 }) => {
    let options = {}
    if (!isEmpty(type)) {
        options = { type }
    } else if (!isEmpty(types)) {
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
            try {
                const decoded = await check({ ctx, want: 'cms_create' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@cms_create')
                }

                const _news = await News.forge({
                    ...news,
                    userId
                }).save()

                return _news.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },
        async deleteNews(root, { ids }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'cms_delete' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@cms_delete')
                }

                const _news = await News
                    .whereIn('id', ids)
                    .where({ userId: id })
                    .fetch()

                if (isEmpty(_news)) {
                    return 0
                }

                await _news.set({ status: 'deleted' }).save()

                console.info(_news, 'item(s) deleted.')

                return 10086
            } catch (e) {
                throw new Error(e)
            }
        },
        async permanentlyDeleteNews(root, { ids }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'cms_delete' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@cms_delete')
                }

                const _news = await knex('news')
                    .whereIn('id', ids)
                    .where({ userId })
                    .del()

                return _news
            } catch (e) {
                throw new Error(e)
            }
        },
        async updateNews(root, { news }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'cms_update' })
                const userId = decoded.id
                if (isEmpty(userId)) {
                    throw new Error('401@cms_update')
                }

                const id = news.id
                if (isEmpty(id)) {
                    throw new Error('Id is required@cms_update')
                }

                const _news = await News
                    .where({ id, userId })
                    .fetch()

                if (isEmpty(_news)) {
                    throw new Error('News Not Found@cms_update')
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
            } catch (e) {
                throw new Error(e)
            }
        }
    }
}

module.exports = resolver
