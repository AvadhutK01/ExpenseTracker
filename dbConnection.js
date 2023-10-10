require('dotenv').config();
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize('expense_data', process.env.DB_CONNECTION_USER, process.env.DB_CONNECTION_PASSWORD, { dialect: "mysql" })
module.exports = sequelize;