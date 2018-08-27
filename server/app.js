const Koa = require('koa')
const logger = require('koa-logger')
const favicon = require('koa-favicon')
const static = require('koa-static')

// APP
const app = new Koa()

app.use(logger())

app.use(favicon('https://blog.feddy.org/favicon.png'))

// VIEWS
const views = require('koa-views')
app.use(views(__dirname + '/views', {
    extension: 'pug'
}))

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

// SERVER UP
app.listen(3000)
