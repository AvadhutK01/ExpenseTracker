const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const router = require('./Routers/routes');
const path = require('path');
const userRoute = require('./Routers/userRoute');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use("/user", userRoute);
app.use(router);
app.listen(3000);