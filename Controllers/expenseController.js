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
    const expenseAmount = body.ExpenseAmount;
    const description = body.ExpenseDesc;
    const expenseType = body.ExpenseType;
    try {
        await ExpenseData.create({
            expenseAmount: expenseAmount,
            description: description,
            expenseType: expenseType,
            userDatumId: id
        });
        res.status(201).json({ data: 'success' })
    } catch (err) {
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
        const id = req.body.id
        const userid = req.user.id;
        await ExpenseData.destroy({ where: { id: id, userDatumId: userid } });
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
    const expenseAmount = body.data.ExpenseAmount;
    const description = body.data.ExpenseDesc;
    const expenseType = body.data.ExpenseType;
    try {
        const expenseData = await ExpenseData.findOne({ where: { id: id, userDatumId: userid } });
        expenseData.expenseAmount = expenseAmount;
        expenseData.description = description;
        expenseData.expenseType = expenseType;
        await expenseData.save();
        res.status(201).json({ data: 'success' })
    } catch (err) {
        console.log(err)
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
                'id',
                'name',
                [sequelize.fn('sum', sequelize.col('expenseData.expenseAmount')), 'total_amount']
            ],
            include: [{
                model: ExpenseData,
                attributes: [],
            }],
            group: ['userdata.id'],
            order: [[sequelize.col('total_amount'), 'DESC']]
        });
        res.status(200).json(LeaderBoardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};
