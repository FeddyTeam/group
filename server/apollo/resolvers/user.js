const { User } = require('../../db')
const { JWT_SECRET } = process.env
const { isEmpty, random, pick, isUndefined, omitBy } = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const check = require('./../../lib/check')

const resolvers = {
    User: {

    },
    Query: {
        async fetchUsers(root, _, ctx, info) {
            try {
                const { id } = await check({ ctx })
                if (isEmpty(id)) {
                    throw new Error('401@users_fetch')
                }

                const results = await User.fetchAll()

                console.log(results.toJSON())

                return results.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },

        async fetchUser(root, { id }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'adm:user_fetch' })
                const admId = decoded.id
                if (isEmpty(admId)) {
                    throw new Error('adm:user_fetch')
                }

                const results = await User
                    .where('id', id)
                    .fetch()

                return results.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },

        async getProfile(root, _, ctx, info) {
            try {
                const { id } = await check({ ctx })
                if (isEmpty(id)) {
                    throw new Error('401@profile_fetch')
                }

                const results = await User
                    .where('id', id)
                    .where('status', 'actived')
                    .fetch()

                return results.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        }
    },
    Mutation: {
        async createUser(root, { user: { username, password, email } }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'adm:user_create' })
                const admId = decoded.id
                if (isEmpty(admId)) {
                    throw new Error('401@adm:user_create')
                }

                const hashedPassword = await bcrypt.hash(password, 6)

                const _user = await User.forge({
                    email,
                    password: hashedPassword,
                    username: username || `r_${new Date().getTime()}_${random(1000, 10000)}`,
                    avatar: 'https://static.feddy.org/avatar.jpg'
                }).save()

                return _user.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },

        async updateUser(root, { user }, ctx, info) {
            try {
                const decoded = await check({ ctx, want: 'adm:user_create' })
                const admId = decoded.id
                if (isEmpty(admId)) {
                    throw new Error('401@adm:user_update')
                }

                const { id } = user
                const _user = await User
                    .where('id', id)
                    .fetch()

                let changes = pick(user, ['adm', 'cms', 'abc', 'username', 'name', 'email', 'status', 'avatar'])
                changes = omitBy(changes, isUndefined)

                await _user.set(changes).save()

                return _user.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },

        async updateProfile(root, { profile }, ctx, info) {
            try {
                const { id } = await check({ ctx })
                if (isEmpty(id)) {
                    throw new Error('401@profile_update')
                }

                const { name, url, bio, avatar } = profile
                const birthday = new Date(profile.birthday)
                const _user = await User
                    .where('id', id)
                    .fetch()

                await _user.set({
                    name, url, bio, birthday, avatar
                }).save()

                return _user.toJSON()
            } catch (e) {
                throw new Error(e)
            }
        },

        async updatePassword(root, { passwords }, ctx, info) {
            try {
                const { id } = await check({ ctx })
                if (isEmpty(id)) {
                    throw new Error('401@password_update')
                }

                const { password, newPassword } = passwords
                const _user = await User
                    .where('id', id)
                    .fetch()

                if (isEmpty(_user)) {
                    throw new Error('user_not_found@password_update')
                }
                const user = _user.toJSON()

                const result = await bcrypt.compare(password, user.password)
                if (!result) {
                    throw new Error('wrong_password@password_update')
                }

                const hashedPassword = await bcrypt.hashSync(newPassword, 6)

                await _user.set({
                    password: hashedPassword
                }).save()

                return true
            } catch (e) {
                throw new Error(e)
            }
        },

        async login(root, { form }, ctx, info) {
            const { username, password, code = 0 } = form
            try {
                const _user = await User.where('email', username).fetch()
                if (isEmpty(_user)) {
                    throw new Error('user_not_found@login')
                }

                const user = _user.toJSON()
                const result = await bcrypt.compare(password, user.password)
                if (!result) {
                    throw new Error('wrong_password@login')
                }

                const { lgd=1, adm=0, cms=0, abc=0  } = user

                const token = jwt.sign({
                    id: user.id, keys: { lgd, abc, cms, adm }
                }, JWT_SECRET, {
                    expiresIn: '1d'
                })

                return { token, user }
            } catch (e) {
                if (e.message.endsWith('@login')) {
                    throw new Error(e)
                } else {
                    console.error(e)
                    throw new Error('server_error@login')
                }
            }
        }
    }
}

module.exports = resolvers
