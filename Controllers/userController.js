const path = require('path');
const userDb = require('../Models/userModel');

exports.getRegistrationPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "RegistrationPage.html"));
};

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "LoginPage.html"));
};

exports.postRegistrationData = async (req, res) => {
    const body = req.body;
    const name = body.nameInput;
    const phoneNo = body.phoneInput;
    const email = body.emailInput;
    const passWord = body.passwordInput;

    try {
        await userDb.create({
            name: name,
            phoneNo: phoneNo,
            email: email,
            passWord: passWord
        });
        res.json({ data: 'success' });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.json({ data: 'exist' });
        } else {
            res.json({ data: 'error' });
        }
    }
};
