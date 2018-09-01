const cfg = require('dotenv').config().parsed
const Koa = require('koa')
const logger = require('koa-logger')
const favicon = require('koa-favicon')
const static = require('koa-static')
const { ApolloServer } = require('apollo-server-koa')
const schema = require('./apollo')
const server = new ApolloServer(schema)

// APP
const app = new Koa()

app.use(logger())

app.use(favicon('./public/logo.png'))

// VIEWS
const views = require('koa-views')
app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

// CORS : Development Only
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080')
    ctx.set('Access-Control-Allow-Credentials', true)
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    ctx.set('Access-Control-Allow-Methods', 'POST, OPTIONS, PUT')
    await next()
})

// SESSION
const session = require('koa-session')
app.keys = ['hello world!'];
app.use(session({}, app))

// BODY PARSER
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// PASSPORT
const passport = require('./lib/passport')
app.use(passport.initialize())
app.use(passport.session())

// STATIC FILES
app.use(static('./server/public'))

// ROUTES
const router = require('./routes')({
    passport,
})
app
    .use(router.routes())
    .use(router.allowedMethods())

server.applyMiddleware({ app, path: '/graphql'})

// SERVER UP
app.listen(cfg.SERVER_PORT, () => {
    console.info(`>>>>>> Server Up at ${cfg.SERVER_PORT} <<<<<<`)
})
