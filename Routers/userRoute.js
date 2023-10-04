const express = require('express');
let userRoute = express.Router();
const userController = require('../Controllers/userController');
userRoute.get('/register', userController.getRegistrationPage);
userRoute.get('/login', userController.getLoginPage);
userRoute.post('/addUser', userController.postRegistrationData);
userRoute.post('/check-login', userController.checkLogin);
module.exports = userRoute;