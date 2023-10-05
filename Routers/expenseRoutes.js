const express = require('express');
const expenseController = require('../Controllers/expenseController');
const authnticateUser = require('../MiddleWares/auth');
const expenseRoutes = express.Router();
expenseRoutes.get('/MainHome', expenseController.getExpenseMainHomePage);
expenseRoutes.get('/expenseMain', expenseController.getExpenseMainPage);
expenseRoutes.post('/post-expense', authnticateUser, expenseController.addExpense);
expenseRoutes.get('/viewExpenses', expenseController.getExpensesViewPage);
expenseRoutes.get('/viewExpensesData', authnticateUser, expenseController.getExpensesData);
expenseRoutes.post('/deleteExpensedata', authnticateUser, expenseController.deleteExpenseData);
expenseRoutes.post('/update-expense', authnticateUser, expenseController.updateExpense);
module.exports = expenseRoutes;