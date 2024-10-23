const { registerUser, loginUser } = require('../services/userServices') 
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body; 

        const result = await registerUser(username, email, password, role); 
console.log({ username, email, password, role });

        return res.status(result.responseCode).json(result);
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            result: {},
            message: 'An unexpected error occurred. Please try again later.',
            status: 'error',
            responseCode: 500,
            reason: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        return res.status(result.responseCode).json(result);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            result: {},
            message: 'An unexpected error occurred. Please try again later.',
            status: 'error',
            responseCode: 500,
            reason: error.message
        });
    }
};
