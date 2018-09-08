const Router = require('koa-router')
const router = new Router()
const { User, News, knex } = require('../db')
const bcrypt = require('bcrypt')
const qiniu = require('qiniu')
const jwt = require('jsonwebtoken')
const { isEmpty, groupBy } = require('lodash')
const util = require('util')

const parseFeed = require('../lib/feed')

function insertOrUpdate(tableName, items) {
    return knex.transaction(trx => {
        const queries = items.map(tuple =>
            trx.raw(util.format('%s ON DUPLICATE KEY UPDATE %s',
                trx(tableName).insert(tuple).toString().toString(),
                trx(tableName).update(tuple).whereRaw(`'${tableName}'.id = '${tuple.id}'`)
                    .toString()
                    .replace(/^update\s.*\sset/i, '')
                    .replace(/where\s.*\s.*$/i, '')
            )).transacting(trx)
        )

        return Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
}

module.exports = function ({ cfg }) {
    return router
        .get('/', async ctx => {

            const _results = await News
                .where('status', '=', 'actived')
                .where('level', '!=', 'removed')
                .where('type', 'in', ['news', 'post', 'event', 'notice', 'alert'])
                .orderBy('-createdAt')
                .fetchAll()

            const results = groupBy(_results.toJSON(), 'type')

            console.log(results)

            // ctx.body = results.toJSON()
            await ctx.render('index', {
                news: results,
                key: 111111
            })
        })
        .get('/r1', async ctx => {

            const _results = await News
                .where('status', '=', 'actived')
                .where('level', '!=', 'removed')
                .where('type', 'in', ['news', 'post', 'event', 'notice', 'alert'])
                .orderBy('-createdAt')
                .fetchAll()

            ctx.body = _results.toJSON()
        })
        .get('/check-rss', async ctx => {
            try {
                const posts = await parseFeed('https://blog.feddy.org/rss')
                const user = await User
                    .where({ status: 'actived', cms: true, adm: true })
                    .fetch()

                const userId = user.toJSON().id

                const  items = posts.map(one => {
                    return {
                        ...one,
                        userId
                    }
                })

                // const news = await knex('news').insert(items)
                await insertOrUpdate('news', items)

                ctx.body = {
                    message: 'success'
                }
            } catch (err) {
                console.log(err)
                ctx.status = 500
                ctx.body = err.message
            }
        })
        .get('/login', async ctx => {
            await ctx.render('login')
        })
        .get('/logout', ctx => {
            ctx.logout()
            ctx.redirect('/')
        })
        // .post('/login', auth)
        .post('/login_ajax', async ctx => {
            const { username, password } = ctx.request.body
            try {
                const _user = await User.where('email', username).fetch()
                if (isEmpty(_user)) {
                    ctx.body = { message: 'User not found' }
                    ctx.status = 401
                    return
                }

                const user = _user.toJSON()
                const result = await bcrypt.compare(password, user.password)
                if (!result) {
                    ctx.body = { message: 'Username or password error' }
                    ctx.status = 401
                    return
                }

                await ctx.login(user)

                const id = user.id
                const token = jwt.sign({
                    id, keys: {adm:1,cms:1,abc:1,rss:1}
                }, cfg.JWT_SECRET, {
                    expiresIn: '1d'
                })

                ctx.body = {ok: true, message: 'Success', token}
            } catch (e) {
                console.info(e)
                ctx.body = { message: 'Unknown error' }
                ctx.status = 500
            }
        })
        .get('/rss', async ctx => {
            const parser = new Parser()

            try {
                const feed = await parser.parseURL('https://note.zerook.net/rss')
                console.log(feed.title)

                feed.items.forEach(item => {
                  console.log(item.title + ':' + item.link)
                })

                ctx.body = feed
            } catch (err) {
                console.log(err.message)
                ctx.body = err.message
            }
        })
        .get('/k/qiniu', async ctx => {
            try {
                const authorization = ctx.request.header.authorization
                if (!authorization) {
                    throw new Error('JWT: Authorization header not found')
                }

                const results = authorization.split(' ')
                const type = results[0]
                const token = results[1]

                if (type !== 'Bearer') {
                    throw new Error('JWT: Bearer type not found')
                }

                console.info(token, cfg.JWT_SECRET)

                await jwt.verify(token, cfg.JWT_SECRET)
            } catch(err) {
                ctx.status = 401
                ctx.body = { message: err.message }
                return
            }

            // QINIU CLOUD
            const qiniuMac = new qiniu.auth.digest.Mac(cfg.QINIU_ACCESS_KEY, cfg.QINIU_SECRET_KEY)
            const putPolicy = new qiniu.rs.PutPolicy({
                scope: cfg.QINIU_BUCKET
            })

            const uploadToken = putPolicy.uploadToken(qiniuMac)

            ctx.body = {
                uptoken: uploadToken
            }
        })

}
