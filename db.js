const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || `postgresql://postgres:${encodeURIComponent(process.env.PASS)}@localhost/hoa-log`, {
    dialect: 'postgres',
    ssl: process.env.ENVIRONMENT === 'production'
})

module.exports = sequelize; 