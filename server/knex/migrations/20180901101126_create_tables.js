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
    })
}

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('users')
        .dropTable('bubbles')
        .dropTable('comments')
}
