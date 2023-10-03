const { Sequelize } = require("sequelize");
const sequelize = new Sequelize('expense_data', 'root', 'root123', { dialect: "mysql" })
module.exports = sequelize;