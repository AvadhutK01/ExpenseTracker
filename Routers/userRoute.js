const express = require('express');
let userRoute = express.Router();
const userController = require('../Controllers/userController');
userRoute.get('/register', userController.getRegistrationPage);
userRoute.get('/login', userController.getLoginPage);
userRoute.post('/addUser', userController.postRegistrationData);
userRoute.post('/check-login', userController.checkLogin);
userRoute.post('/SendforgetPasswordLink', userController.SendforgetPasswordLink);
userRoute.get('/forgetPassword/:id', userController.getForgetPasswordPage);
userRoute.post('/updatePasswordData', userController.updatePasswordData);
module.exports = userRoute;