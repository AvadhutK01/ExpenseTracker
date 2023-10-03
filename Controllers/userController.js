const path = require('path');
exports.getRegistrationPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "RegistrationPage.html"))
}
exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "LoginPage.html"))
}