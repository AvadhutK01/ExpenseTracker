const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const router = require('./Routers/routes');
const path = require('path');
const userRoute = require('./Routers/userRoute');
const sequelize = require('./dbConnection');
const expenseRoutes = require('./Routers/expenseRoutes');
const userDb = require('./Models/userModel');
const ExpenseData = require('./Models/ExpenseModel');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/user", userRoute);
app.use('/expense', expenseRoutes)
app.use(router);
userDb.hasMany(ExpenseData);
ExpenseData.belongsTo(userDb);
sequelize.sync().then(() => app.listen(3000)).catch((err) => {
    console.log(err)
})
