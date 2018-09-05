const Router = require('koa-router')
const router = new Router()
const { User } = require('../db')
const bcrypt = require('bcrypt')
const qiniu = require('qiniu')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

module.exports = function ({ cfg }) {
    return router
        .get('/', async ctx => {
            await ctx.render('index')
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
                if (_.isEmpty(_user)) {
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
