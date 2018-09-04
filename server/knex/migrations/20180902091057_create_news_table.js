
exports.up = function(knex, Promise) {
    return knex.schema.dropTableIfExists('news').createTable('news', function (table) {
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

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('news')
}
