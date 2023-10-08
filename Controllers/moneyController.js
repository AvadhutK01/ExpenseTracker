const path = require('path');
const userDb = require('../Models/userModel');
const sequelize = require('../dbConnection');
const moneyData = require('../Models/moneyModel');
const yearlyReportDb = require('./YearlyReportModel');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');
const { uploadToS3 } = require('../services/S3Services');
const DurlDb = require('../Models/filesDownloadUrlModel');
exports.getExpenseMainHomePage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "mainHome.html"));
};

exports.getExpenseMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "expenseMain.html"));
};

exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const body = req.body;
    const id = req.user.id;
    const Amount = parseInt(body.Amount);
    const description = body.Desc;
    const sourceType = body.Type;
    const Etype = body.Etype;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const formattedDate = `${currentMonth.toString().padStart(2, '0')}-${currentYear}`;
    try {
        const result = await userDb.findByPk(id, { attributes: ['totalExpense', 'totalIncome'], transaction: t });
        const Yearlyresult = await yearlyReportDb.findAll({ where: { userDatumId: id, year: formattedDate.toString() }, attributes: ['TotalExpense', 'TotalIncomme', 'year'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);
        const totalIncome = parseInt(result.totalIncome);
        let MonthlyTotalExpense = 0;
        let MonthlyTotalIncome = 0;
        if (Yearlyresult.length > 0) {
            MonthlyTotalExpense = parseInt(Yearlyresult[0].TotalExpense);
            MonthlyTotalIncome = parseInt(Yearlyresult[0].TotalIncomme);
        }
        await moneyData.create({
            Amount: Amount,
            description: description,
            sourceType: sourceType,
            type: Etype,
            userDatumId: id
        }, { transaction: t });
        console.log(Yearlyresult)
        if (Etype == 'Expense') {
            if (Yearlyresult && Yearlyresult.length > 0) {
                if (Yearlyresult[0].year == formattedDate) {
                    await yearlyReportDb.update({ TotalExpense: MonthlyTotalExpense + Amount }, { where: { userDatumId: id, year: formattedDate }, transaction: t });
                }
            }
            else {
                await yearlyReportDb.create({ year: formattedDate, TotalExpense: Amount, userDatumId: id }, { transaction: t })
            }
            await calculateAndUpdateSavings(id, formattedDate, t);
            await userDb.update({ totalExpense: totalExpense + Amount }, { where: { id: id }, transaction: t });
        }
        else {
            if (Yearlyresult && Yearlyresult.length > 0) {
                if (Yearlyresult[0].year == formattedDate) {
                    await yearlyReportDb.update({ TotalIncomme: MonthlyTotalIncome + Amount }, { where: { userDatumId: id, year: formattedDate }, transaction: t });
                }
            }
            else {
                await yearlyReportDb.create({ year: formattedDate, TotalIncomme: Amount, userDatumId: id }, { transaction: t })
            }
            await calculateAndUpdateSavings(id, formattedDate, t);
            await userDb.update({ totalIncome: totalIncome + Amount }, { where: { id: id }, transaction: t });
        }

        await t.commit();
        res.status(201).json({ data: 'success' });
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ data: 'error' });
    }
};

exports.getExpensesViewPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "viewExpenses.html"));
};

exports.getExpensesData = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await moneyData.findAll({ where: { userDatumId: id } });
        res.json(result);
    } catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err);
    }
};

exports.getYearlyExpensesData = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await yearlyReportDb.findAll({ where: { userDatumId: id } });
        res.json(result);
    } catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err);
    }
}

exports.getDownloadUrl = async (req, res) => {
    try {
        const id = req.user.id;
        const result = await DurlDb.findAll({ where: { userDatumId: id } });
        res.json(result);
    } catch (err) {
        res.status(500).json({ data: 'error' });
        console.log(err);
    }
}
exports.deleteExpenseData = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const id = req.body.id;
        const userid = req.user.id;
        const Amount = parseInt(req.body.Amount);
        const Etype = req.body.Etype;
        const moneyDataRecord = await moneyData.findOne({ where: { id: id, userDatumId: userid } });
        const { updatedAt } = moneyDataRecord;
        const currentMonth = updatedAt.getMonth() + 1;
        const currentYear = updatedAt.getFullYear();
        const formattedDate = `${currentMonth.toString().padStart(2, '0')}-${currentYear}`;

        const yearlyResult = await yearlyReportDb.findOne({ where: { userDatumId: userid, year: formattedDate }, transaction: t });
        if (!yearlyResult) {
            throw new Error('Yearly report not found for the specified month and year.');
        }

        const YearlytotalExpense = parseInt(yearlyResult.TotalExpense);
        const YearlytotalIncome = parseInt(yearlyResult.TotalIncomme);
        const savings = parseInt(yearlyResult.Savings);

        const result = await userDb.findByPk(userid, { attributes: ['totalExpense', 'totalIncome'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);
        const totalIncome = parseInt(result.totalIncome);

        await moneyData.destroy({ where: { id: id, userDatumId: userid }, transaction: t });

        if (Etype === 'Expense') {
            await yearlyReportDb.update({ TotalExpense: YearlytotalExpense - Amount, Savings: savings + Amount }, { where: { userDatumId: userid, year: formattedDate }, transaction: t });
            await userDb.update({ totalExpense: totalExpense - Amount }, { where: { id: userid }, transaction: t });
        } else {
            await yearlyReportDb.update({ TotalIncomme: YearlytotalIncome - Amount, Savings: savings - Amount }, { where: { userDatumId: userid, year: formattedDate }, transaction: t });
            await userDb.update({ totalIncome: totalIncome - Amount }, { where: { id: userid }, transaction: t });
        }

        await t.commit();
        res.redirect('/expense/viewExpenses');
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ data: 'error' });
    }
};

exports.updateExpense = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const body = req.body;
        const id = body.id;
        const Etype = body.Etype;
        const userid = req.user.id;
        const newExpenseAmount = parseInt(body.data.Amount);
        const newDescription = body.data.Desc;
        const newExpenseType = body.data.Type;
        console.log(newExpenseType)
        const moneyDatavalue = await moneyData.findOne({ where: { id: id, userDatumId: userid }, transaction: t });
        const oldExpenseAmount = parseInt(moneyDatavalue.Amount);
        const updatedAt = moneyDatavalue.updatedAt;
        const currentMonth = updatedAt.getMonth() + 1;
        const currentYear = updatedAt.getFullYear();
        const formattedDate = `${currentMonth.toString().padStart(2, '0')}-${currentYear}`;

        moneyDatavalue.Amount = parseInt(newExpenseAmount);
        moneyDatavalue.description = newDescription;
        moneyDatavalue.sourceType = newExpenseType;

        await moneyDatavalue.save({ transaction: t });


        const result = await userDb.findByPk(userid, { attributes: ['totalExpense', 'totalIncome'], transaction: t });
        const totalExpense = parseInt(result.totalExpense);
        const totalIncome = parseInt(result.totalIncome);
        const expenseAmountDifference = oldExpenseAmount - newExpenseAmount;

        const yearlyResult = await yearlyReportDb.findOne({ where: { userDatumId: userid, year: formattedDate }, transaction: t });
        const YearlytotalExpense = parseInt(yearlyResult.TotalExpense);
        const YearlytotalIncome = parseInt(yearlyResult.TotalIncomme);
        const savings = parseInt(yearlyResult.Savings);
        const TotalexpenseAmountDifference = parseInt(oldExpenseAmount - newExpenseAmount);

        if (Etype == 'Expense') {
            await yearlyReportDb.update({ TotalExpense: YearlytotalExpense - TotalexpenseAmountDifference, Savings: savings + TotalexpenseAmountDifference }, { where: { userDatumId: userid, year: formattedDate }, transaction: t });
            await userDb.update({ totalExpense: totalExpense - expenseAmountDifference }, { where: { id: userid }, transaction: t });
        } else {
            await yearlyReportDb.update({ TotalIncomme: YearlytotalIncome - TotalexpenseAmountDifference, Savings: savings - TotalexpenseAmountDifference }, { where: { userDatumId: userid, year: formattedDate }, transaction: t });
            await userDb.update({ totalIncome: totalIncome - expenseAmountDifference }, { where: { id: userid }, transaction: t });
        }

        await t.commit();
        res.status(201).json({ data: 'success' });
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({ data: 'error' });
    }
};


exports.getLeaderBoardPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "expenseLeaderBoard.html"));
};

exports.getLeaderBoardData = async (req, res) => {
    try {
        const LeaderBoardData = await userDb.findAll({
            attributes: [
                'name',
                'totalExpense',
                'totalIncome'
            ],
            order: [[sequelize.col('totalExpense'), 'DESC']]
        });
        res.status(200).json(LeaderBoardData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};

exports.getViewMonetaryPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "viewMonetaryData.html"));
}


exports.downloadExpense = async (req, res) => {
    const userId = req.user.id;
    const date = new Date().toLocaleString().replace(/\//g, '-')
    const { dailyData, weeklyData, monthlyData, yearlyData } = req.body;

    const yearlyDataValues = [
        ['Section', 'MonthYear', 'Total Income', 'Total Expense', 'Savings'],
        ...createDataArrayWithYearlySection('Yearly Data', yearlyData),
    ]
    const allData = [
        ['Section', 'Date', 'Amount', 'SourceType', 'Description', 'Type'],
        ...createDataArrayWithSection('Daily Data', dailyData),
        ...createDataArrayWithSection('Weekly Data', weeklyData),
        ...createDataArrayWithSection('Monthly Data', monthlyData),
        ...yearlyDataValues
    ];
    function createDataArrayWithSection(section, data) {
        return data.map(item => [section, item.date, item.amount, item.sourceType, item.description, item.type]);
    }

    function createDataArrayWithYearlySection(section, data) {
        return data.map(item => [section, item.monthYear, item.totalIncome, item.totalExpense, item.savings]);
    }
    const worksheet = XLSX.utils.aoa_to_sheet(allData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Combined Data');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const fileName = `expense${userId}/Report_date-${date}.xlsx`;
    await uploadToS3('mynewexpensebucket', buffer, fileName)
        .then(async (fileUrl) => {
            res.setHeader('Content-Disposition', 'attachment; filename=expense.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            await DurlDb.create({
                date: date,
                fileUrl: fileUrl,
                userDatumId: userId
            });
            res.status(200).json({ fileUrl, success: true });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload file to S3' });
        });
}




async function calculateAndUpdateSavings(id, formattedDate, t) {
    const yearlyResult = await yearlyReportDb.findOne({ where: { userDatumId: id, year: formattedDate }, transaction: t });
    if (yearlyResult) {
        const totalExpense = parseInt(yearlyResult.TotalExpense);
        const totalIncome = parseInt(yearlyResult.TotalIncomme);
        const savings = parseInt(totalIncome - totalExpense);
        await yearlyReportDb.update({ Savings: savings }, { where: { userDatumId: id, year: formattedDate }, transaction: t });
        return savings;
    }
    return 0;
}