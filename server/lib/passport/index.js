const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const { User } = require('../../models')

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log(arguments)

        User.findOne({ where: {
            email: username
        }}).then(user => {

            if (!user) {
                return done(null, false)
            }

            bcrypt.compare(password, user.password).then(result => {
                return done(null, user)
            }).catch(err => {
                return done(null, false)
            })

        }).catch(err => {
            return done(err)
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

