const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../../db')

passport.use(new LocalStrategy(
    async function (username, password, done) {
        const _user = await User.where('email', username).fetch()
        if (_.isEmpty(_user)) {
            return done(null, false)
        }

        const user = _user.toJSON()

        bcrypt.compare(password, user.password).then(result => {
            return done(null, user)
        }).catch(err => {
            return done(null, false)
        })
    }
))

passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    return done(null, user)
})

module.exports = passport

