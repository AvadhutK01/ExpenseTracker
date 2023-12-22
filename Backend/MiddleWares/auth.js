const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const userDb = require("../Models/userModel");

//Authenticating user with jwt token and checking if user exists in database and passing it to request
const authenticateUser = async (req, res, next) => {
    try {
        const cookies = cookie.parse(req.headers.cookie || ''); // Parse cookies from the request headers

        const token = cookies.token; // Get the token from the "token" cookie
        console.log(token);

        if (!token) {
            return res.redirect('/');
        }

        const user = jwt.verify(token, process.env.SECRETKEY);
        const result = await userDb.findByPk(user.userid);

        if (!result) {
            return res.status(401).json({ data: 'failed' });
        }

        req.user = result;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ data: 'failed' });
    }
};

module.exports = authenticateUser;
