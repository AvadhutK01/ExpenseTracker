const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const router = require('./Routers/routes');
const path = require('path');
const userRoute = require('./Routers/userRoute');
const sequelize = require('./dbConnection');
const expenseRoutes = require('./Routers/expenseRoutes');
const userDb = require('./Models/userModel');
const payRoute = require('./Routers/paymentRoutes');
require('dotenv').config();
const OrderData = require('./Models/paymentModel');
const forgetPasswordModel = require('./Models/forgetPasswordModel');
const moneyData = require('./Models/moneyModel');
const DurlDb = require('./Models/filesDownloadUrlModel');
const yearlyReportDb = require('./Models/YearlyReportModel');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/user", userRoute);
app.use('/expense', expenseRoutes)
app.use('/payment', payRoute);
app.use(router);
userDb.hasMany(moneyData);
moneyData.belongsTo(userDb);
userDb.hasMany(OrderData);
OrderData.belongsTo(userDb);
userDb.hasMany(forgetPasswordModel);
forgetPasswordModel.belongsTo(userDb);
userDb.hasMany(yearlyReportDb);
yearlyReportDb.belongsTo(userDb);
userDb.hasMany(DurlDb);
DurlDb.belongsTo(userDb);
sequelize.sync().then(() => app.listen(3000)).catch((err) => {
    console.log(err)
})
