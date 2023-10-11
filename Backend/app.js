const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const router = require('./Routers/routes');
const path = require('path');
const userRoute = require('./Routers/userRoute');
const sequelize = require('./dbConnection');
const expenseRoutes = require('./Routers/expenseRoutes');
const userDb = require('./Models/userModel');
const payRoute = require('./Routers/paymentRoutes');
const OrderData = require('./Models/paymentModel');
const forgetPasswordModel = require('./Models/forgetPasswordModel');
const moneyData = require('./Models/moneyModel');
const DurlDb = require('./Models/filesDownloadUrlModel');
const yearlyReportDb = require('./Models/YearlyReportModel');
const fst = require('fs');
const compression = require('compression');
const morgan = require('morgan');
const app = express();
const accessLogStream = fst.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }))
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));
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
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => app.listen(PORT)).catch((err) => {
    console.log(err);
});
