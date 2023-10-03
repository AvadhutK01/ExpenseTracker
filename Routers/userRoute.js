const express = require('express');
let userRoute = express.Router();
const userController = require('../Controllers/userController');
userRoute.get('/register', userController.getRegistrationPage);
userRoute.get('/login', userController.getLoginPage);
userRoute.post('/addUser', userController.postRegistrationData);
module.exports = userRoute;