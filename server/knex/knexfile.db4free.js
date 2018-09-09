require('dotenv').config()

module.exports = {
    testing: {
        client: 'mysql',
        connection: process.env.DB4FREE_URL,
        debug: true,
    },
};
