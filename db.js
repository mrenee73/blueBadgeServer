const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:YOURPASSWORDHERE@localhost:5432/hoa-log')

module.exports = sequelize; 