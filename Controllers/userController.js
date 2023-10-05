const path = require('path');
const userDb = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../dbConnection');

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
    const passwordInput = body.passwordInput;

    const t = await sequelize.transaction();
    try {
        const passWord = await bcrypt.hash(passwordInput, 10);
        await userDb.create({
            name: name,
            phoneNo: phoneNo,
            email: email,
            passWord: passWord
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ data: 'success' });
    } catch (err) {
        await t.rollback();
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(409).json({ data: 'exist' });
        } else {
            console.error(err);
            res.status(500).json({ data: 'error' });
        }
    }
};

exports.checkLogin = async (req, res) => {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    const t = await sequelize.transaction();
    try {
        let data = await userDb.findOne({
            where: {
                email: email
            },
            transaction: t
        });

        if (data) {
            const checkLogin = await bcrypt.compare(password, data.passWord);
            if (checkLogin) {
                await t.commit();
                res.status(201).json({ data: 'success', token: generateAccessToken(data.id) });
            } else {
                await t.rollback();
                res.status(401).json({ data: 'Failed' });
            }
        } else {
            await t.rollback();
            res.status(404).json({ data: 'NotExist' });
        }
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ data: 'error' });
    }
};

function generateAccessToken(id) {
    return jwt.sign({ userid: id }, process.env.SECRETKEY);
}
