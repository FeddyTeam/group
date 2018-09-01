// Update with your config settings.

module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'abc0123',
            database: 'database_development',
            charset: 'utf8mb4'
        },
        debug: true,
    },

    staging: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'abc0123',
            database: 'database_development',
            charset: 'utf8'
        },
        debug: true,
    },

    production: {
        client: 'mysql',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'abc0123',
            database: 'database_development',
            charset: 'utf8'
        },
        debug: true,
    }

};
