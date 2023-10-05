const path = require('path');
const userDb = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    try {
        const passWord = await bcrypt.hash(body.passwordInput, 10);
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
            const checkLogin = await bcrypt.compare(passWord, data.passWord);
            if (checkLogin) {
                res.status(201).json({ data: 'success', token: generateAccessToken(data.id) });
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

function generateAccessToken(id) {
    return jwt.sign({ userid: id }, '8jR2sWnC4xQzHtUyL6vPbM9aZ3gD7eF1sK0oT8iN6cA2mV3zL7jX8wO9tR0hY5sF1iE3oQ1cK6gW2hS4aJ5bP9eV0jU4iO2qD6rH3lN9mS7tP1rY2gT8bA1uO3zR')
}