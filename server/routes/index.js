const Router = require('koa-router')
const router = new Router()
const { News } = require('../db')
const { groupBy } = require('lodash')

module.exports = function () {
    return router
        .get('/', async ctx => {
            const _base = await News
                .where('status', '=', 'actived')
                .where('level', 'in', ['normal', 'featured'])
                .where('type', 'in', ['news', 'event', 'notice', 'alert', 'project'])
                .orderBy('-createdAt')
                .fetchAll()

            const _posts = await News
                .where('status', '=', 'actived')
                .where('level', 'in', ['normal', 'featured'])
                .where('type', 'post')
                .orderBy('-createdAt')
                .fetchAll()

            const _mustreads = await News
                .where('status', '=', 'actived')
                .where('level', 'mustread')
                .orderBy('-createdAt')
                .fetchAll()

            const post = _posts.toJSON()
            const mustread = _mustreads.toJSON()
            const base = _base.toJSON()

            const results = {
                ...groupBy(base, 'type'),
                post,
                mustread
            }

            await ctx.render('index', results)
        })
}
