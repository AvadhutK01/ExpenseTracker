const { Sequelize, DECIMAL } = require("sequelize");
const sequelize = require("../dbConnection");
const ExpenseData = sequelize.define('expenseData', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    expenseAmount: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expenseType: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
module.exports = ExpenseData;