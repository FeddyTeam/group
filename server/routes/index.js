const Router = require('koa-router')
const router = new Router()
const { Bubble, User, Comment } = require('../models')
const graphql = require('../graphql')



module.exports = function ({ passport }) {
    const auth = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })

    const needLogin = async (ctx, next) => {
        if (ctx.isAuthenticated()) {
            await next()
        } else {
            ctx.redirect('/login')
        }
    }

    return router
        .get('/', async ctx => {
            await ctx.render('index')
        })
        .get('/login', async ctx => {
            await ctx.render('login')
        })
        .post('/login', auth)
        .get('/me', needLogin, ctx => {
            ctx.body = ctx.state.user
        })
        .get('/profile', needLogin, async ctx => {
            await ctx.render('profile', {
                user: ctx.state.user
            })
        })
        .get('/logout', ctx => {
            ctx.logout()
            ctx.redirect('/')
        })
        .get('/bubbles', needLogin, async ctx => {
            const bubbles = await Bubble.findAll({
                limit: 12,
                include: [{
                    model: User,
                    as: 'user'
                }, {
                    model: Comment,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                }]
            })
            console.info(bubbles)
            await ctx.render('bubbles', {
                bubbles
            })
        })
        .get('/bubbles/count', needLogin, async ctx => {
            const bubbles = await Bubble.findAll({
                limit: 12,
                include: [{
                    model: User,
                    as: 'user'
                }, {
                    model: Comment,
                    as: 'comments',
                    include: [{
                        model: User,
                        as: 'user'
                    }]
                }]
            })
            console.info(bubbles)
            ctx.body = bubbles
        })
        .get('/g', async ctx => {
            const q = ctx.query.q
            ctx.body = await graphql(q)
        })
        .post('/graphql', async ctx => {
            const { query, variables } = ctx.request.body
            ctx.body = await graphql(query, variables)
        })
        .get('/p', ctx => {
            ctx.body = {
                state: ctx.state,
                session: ctx.session
            }
        })
}
