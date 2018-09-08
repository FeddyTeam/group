const bcrypt = require('bcrypt')
const config = require('../knex/knexfile.js')['production']
const knex = require('knex')(config)
const cfg = require('dotenv').config().parsed

const {
    ROOT_EMAIL,
    ROOT_USERNAME,
    ROOT_PASSWORD
} = cfg

console.log(ROOT_EMAIL, ROOT_PASSWORD, ROOT_USERNAME)

knex('users').del().insert([{
    id: 'root',
    username: ROOT_USERNAME,
    email: ROOT_EMAIL,
    password: bcrypt.hashSync(ROOT_PASSWORD, 6),
    name: 'Root',
    avatar: 'https://static.feddy.org/FtnqM8NupRtfw_2-BUArl_nl_GiV?imageView/1/w/256',
    birthday: '2018-09-09',
    createdAt: new Date(),
    updatedAt: new Date(),
    adm: true,
    cms: true,
    abc: true
}]).then(console.info)
