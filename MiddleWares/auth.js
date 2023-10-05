const jwt = require("jsonwebtoken");
const userDb = require("../Models/userModel");
const authnticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        console.log(token)
        const user = jwt.verify(token, '8jR2sWnC4xQzHtUyL6vPbM9aZ3gD7eF1sK0oT8iN6cA2mV3zL7jX8wO9tR0hY5sF1iE3oQ1cK6gW2hS4aJ5bP9eV0jU4iO2qD6rH3lN9mS7tP1rY2gT8bA1uO3zR');
        const result = await userDb.findByPk(user.userid);
        req.user = result;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ data: 'failed' });
    }
}
module.exports = authnticateUser;