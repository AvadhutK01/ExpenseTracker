const path = require('path');
const ExpenseData = require('../Models/ExpenseModel');
const userDb = require('../Models/userModel');
const sequelize = require('../dbConnection');
exports.getExpenseMainHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "mainHome.html"));
};

exports.getExpenseMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "expenseMain.html"));
};
exports.addExpense = async (req, res) => {
    const body = req.body;
    const id = req.user.id;
    const expenseAmount = parseInt(body.ExpenseAmount);
    const description = body.ExpenseDesc;
    const expenseType = body.ExpenseType;
    try {
        const result = await userDb.findByPk(id, { attributes: ['totalExpense'] });
        const totalExpense = parseInt(result.totalExpense)
        await ExpenseData.create({
            expenseAmount: expenseAmount,
            description: description,
            expenseType: expenseType,
            userDatumId: id
        });

        await userDb.update({ totalExpense: totalExpense + expenseAmount }, { where: { id: id } });
        res.status(201).json({ data: 'success' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ data: 'error' });
    }
}

exports.getExpensesViewPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "viewExpenses.html"));
};

exports.getExpensesData = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await ExpenseData.findAll({ where: { userDatumId: id } });
        res.json(result);
    } catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err)
    }
}

exports.deleteExpenseData = async (req, res) => {
    try {
        const id = req.body.id;
        const expenseAmount = parseInt(req.body.ExpenseAmount);
        console.log(expenseAmount)
        const userid = req.user.id;
        const result = await userDb.findByPk(userid, { attributes: ['totalExpense'] });
        const totalExpense = parseInt(result.totalExpense);
        await ExpenseData.destroy({ where: { id: id, userDatumId: userid } });
        await userDb.update({ totalExpense: totalExpense - expenseAmount }, { where: { id: userid } })
        res.redirect('/expense/viewExpenses');
    }
    catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err)
    }
}

exports.updateExpense = async (req, res) => {
    const body = req.body;
    const id = body.id;
    const userid = req.user.id;
    const newExpenseAmount = parseInt(body.data.ExpenseAmount);
    const newDescription = body.data.ExpenseDesc;
    const newExpenseType = body.data.ExpenseType;

    try {
        const expenseData = await ExpenseData.findOne({ where: { id: id, userDatumId: userid } });
        const oldExpenseAmount = expenseData.expenseAmount;
        const expenseAmountDifference = newExpenseAmount - oldExpenseAmount;
        expenseData.expenseAmount = newExpenseAmount;
        expenseData.description = newDescription;
        expenseData.expenseType = newExpenseType;
        await expenseData.save();
        const result = await userDb.findByPk(userid, { attributes: ['totalExpense'] });
        const totalExpense = parseInt(result.totalExpense);
        await userDb.update({ totalExpense: totalExpense + expenseAmountDifference }, { where: { id: userid } });
        res.status(201).json({ data: 'success' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ data: 'error' });
    }
}


exports.getLeaderBoardPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "expenseLeaderBoard.html"));
};

exports.getLeaderBoardData = async (req, res) => {
    try {
        const LeaderBoardData = await userDb.findAll({
            attributes: [
                'name',
                'totalExpense'
            ],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        });
        res.status(200).json(LeaderBoardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};
