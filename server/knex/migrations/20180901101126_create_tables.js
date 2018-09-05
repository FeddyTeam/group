exports.up = function (knex, Promise) {
    return knex.schema.dropTableIfExists('users').createTable('users', function (table) {
        table.uuid('id').primary().unique()
        table.string('email').unique()
        table.enu('status', ['pending', 'actived', 'deleted', 'locked']).defaultTo('actived')
        table.string('avatar')
        table.string('username').unique()
        table.string('name')
        table.string('bio')
        table.string('url')
        table.string('password')
        table.date('birthday')
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())
        table.boolean('adm').defaultTo(false)
        table.boolean('cms').defaultTo(false)
        table.boolean('abc').defaultTo(true)
        table.json('data')
    }).dropTableIfExists('bubbles').createTable('bubbles', function (table) {
        table.uuid('id').primary()
        table.enu('type', ['text', 'embed', 'photo']).defaultTo('text')
        table.enu('status', ['pending', 'actived', 'deleted', 'locked']).defaultTo('actived')
        table.text('text')
        table.string('cover')
        table.string('link')
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())

        table.json('data')
        table.uuid('userId')
        table.foreign('userId').references('id').inTable('users')
    }).dropTableIfExists('comments').createTable('comments', function (table) {
        table.uuid('id').primary()
        table.enu('target', ['bubble']).defaultTo('bubble')
        table.enu('status', ['pending', 'actived', 'deleted', 'locked']).defaultTo('actived')
        table.string('content')
        table.timestamp('createdAt').defaultTo(knex.fn.now())
        table.timestamp('updatedAt').defaultTo(knex.fn.now())

        table.uuid('userId').notNullable()
        table.uuid('bubbleId').notNullable()
        table.foreign('userId').references('id').inTable('users')
        table.foreign('bubbleId').references('id').inTable('bubbles')

    }).dropTableIfExists('news').createTable('news', function (table) {
        table.uuid('id').primary().unique()
        table.string('title').notNullable()
        table.string('altTitle')
        table.string('content')
        table.string('image')
        table.string('altImage')
        table.string('thumbnail')
        table.string('link')
        table.string('color')
        table.string('icon')
        table.integer('weight').defaultTo(0)
        table.json('data')

        table.enu('level', ['removed', 'normal', 'featured', 'mustread']).defaultTo('normal')
        table.enu('type', ['news', 'project', 'event', 'post', 'notice', 'alert', 'story', 'link', 'ad', 'special']).notNullable()
        table.enu('status', ['draft', 'pending', 'actived', 'expired', 'deleted']).defaultTo('actived')

        table.uuid('userId')
        table.foreign('userId').references('id').inTable('users')
        table.datetime('activedAt').defaultTo(knex.fn.now())
        table.datetime('expiredAt').defaultTo('2998-12-31 23:59:59')
        table.datetime('createdAt').defaultTo(knex.fn.now())
        table.datetime('updatedAt').defaultTo(knex.fn.now())
    })
}

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('users')
        .dropTable('bubbles')
        .dropTable('comments')
        .dropTable('news')
}
