const bcrypt = require('bcrypt')
const uuid = require('uuid/v4')
const {
    avatar_of_nano,
    avatar_of_zerook,
    uuid_of_zerook,
    uuid_of_nano,
    uuid_of_bubble_a,
    uuid_of_bubble_b,
    cover_of_bubble_a
} = require('./data.json')

exports.seed = function (knex, Promise) {
    const promiseUsers = knex('users').del().insert([{
        id: uuid_of_zerook,
        username: 'zerook',
        email: 'nullaber@gmail.com',
        password: bcrypt.hashSync('abc0123', 6),
        name: 'Zerook',
        avatar: avatar_of_zerook,
        bio: 'I am building the group ...',
        url: 'https://note.zerok.net',
        birthday: '1995-04-03',
        createdAt: new Date('2018-08-24 16:00:00 +0800'),
        updatedAt: new Date('2018-09-01 12:57:20 +0800'),
        adm: true,
        cms: true,
        abc: true
    }, {
        id: uuid_of_nano,
        username: 'nano',
        email: 'nano@zerook.net',
        password: bcrypt.hashSync('qwerty', 6),
        name: '东云名乃',
        avatar: avatar_of_nano,
        bio: 'Hakase~',
        url: '',
        birthday: '2011-03-07',
        createdAt: new Date('2018-08-26 16:00:00 +0800'),
        updatedAt: new Date('2018-08-31 20:15:00 +0800'),
        cms: true,
        abc: true
    }])

    const promiseBubbles = knex('bubbles').del().insert([{
        id: uuid_of_bubble_a,
        text: '# UNDER CONSTRUCTION \n\n Comming Soon~',
        cover: cover_of_bubble_a,
        link: 'https://example.com',
        userId: uuid_of_zerook,
        createdAt: new Date('2018-09-01 10:00:00 +0800'),
        createdAt: new Date('2018-09-01 10:00:00 +0800')
    }, {
        id: uuid_of_bubble_b,
        text: '我们所经历的每个平凡的日常，也许就是连续发生的奇迹。 / 日々私たちが過ごしている日常は、実は、奇跡の連続なのかもしれない。',
        userId: uuid_of_nano,
        createdAt: new Date('2018-09-01 12:00:00 +0800'),
        createdAt: new Date('2018-09-01 12:00:00 +0800')
    }])

    const promiseComments = knex('comments').del().insert([{
        id: uuid(),
        content: '完成了吗？',
        bubbleId: uuid_of_bubble_a,
        userId: uuid_of_nano,
        createdAt: new Date('2018-09-01 11:00:00 +0800'),
        createdAt: new Date('2018-09-01 11:00:00 +0800')
    }, {
        id: uuid(),
        content: '还没有，快了😂 ',
        bubbleId: uuid_of_bubble_a,
        userId: uuid_of_zerook,
        createdAt: new Date('2018-09-01 11:12:00 +0800'),
        createdAt: new Date('2018-09-01 11:12:00 +0800')
    }, ])

    return Promise.all([
        knex('users').del(),
        knex('bubbles').del(),
        knex('comments').del()
    ]).then(() => Promise.all([
        promiseUsers,
        promiseBubbles,
        promiseComments
    ]))
}
