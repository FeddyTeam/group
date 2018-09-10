const { knex } = require('../db')
const util = require('util')

module.exports = function (tableName, items) {
    return knex.transaction(trx => {
        const queries = items.map(tuple =>
            trx.raw(util.format('%s ON DUPLICATE KEY UPDATE %s',
                trx(tableName).insert(tuple).toString().toString(),
                trx(tableName).update(tuple).whereRaw(`'${tableName}'.id = '${tuple.id}'`)
                    .toString()
                    .replace(/^update\s.*\sset/i, '')
                    .replace(/where\s.*\s.*$/i, '')
            )).transacting(trx)
        )

        return Promise.all(queries).then(trx.commit).catch(trx.rollback)
    })
}
