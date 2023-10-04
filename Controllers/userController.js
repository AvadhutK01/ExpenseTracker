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
        res.status(201).json({ data: 'success' })
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ data: 'exist' });
        } else {
            res.status(500).json({ data: 'error' });
        }
    }
};

exports.checkLogin = async (req, res) => {
    const body = req.body;
    const email = req.body.email;
    const passWord = req.body.password;
    try {
        let data = await userDb.findOne({
            where: {
                email: email
            }
        })
        if (data) {
            const loginCheck = await userDb.findOne({
                where: {
                    email: email,
                    passWord: passWord
                }
            });
            if (loginCheck) {
                res.status(201).json({ data: 'success' });
            }
            else {
                res.status(401).json({ data: 'Failed' });
            }
        }
        else {
            res.status(404).json({ data: 'NotExist' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ data: 'error' });
    }
}
