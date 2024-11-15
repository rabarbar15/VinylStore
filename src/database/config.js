require('dotenv').config();

module.exports = {
    development: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    test: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    production: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
};