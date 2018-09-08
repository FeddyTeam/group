module.exports = {
    testing: {
        client: 'mysql',
        connection: process.env.JAWSDB_URL,
        debug: true,
    }
};
