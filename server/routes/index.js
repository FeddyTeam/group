const Router = require('koa-router')
const router = new Router()
const { User } = require('../db')
const bcrypt = require('bcrypt')
const _ = require('lodash')

module.exports = function ({ passport }) {
    const auth = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })

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
        .post('/login', auth)
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
                ctx.body = { ok: true, message: 'Success' }
            } catch (e) {
                console.info(e)
                ctx.body = { message: 'Unknown error' }
                ctx.status = 500
            }
        })

}
