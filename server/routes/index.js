const Router = require('koa-router')
const router = new Router()
const { News } = require('../db')
const { groupBy } = require('lodash')

module.exports = function () {
    return router
        .get('/', async ctx => {

            const _results = await News
                .where('status', '=', 'actived')
                .where('level', '!=', 'removed')
                .where('type', 'in', ['news', 'post', 'event', 'notice', 'alert', 'project'])
                .orderBy('-createdAt')
                .fetchAll()

            const results = groupBy(_results.toJSON(), 'type')

            console.log(results)

            await ctx.render('index', {
                news: results,
                key: 111111
            })
        })
        .get('/r1', async ctx => {
            const _results = await News
                .where('status', '=', 'actived')
                .where('level', '!=', 'removed')
                .where('type', 'in', ['news', 'post', 'event', 'notice', 'alert', 'project'])
                .orderBy('-createdAt')
                .fetchAll()

            ctx.body = _results.toJSON()
        })
}
