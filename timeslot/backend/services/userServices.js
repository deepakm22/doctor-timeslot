const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/userModel');
const { sendMail } = require('../services/mailServices');
require('dotenv').config();

exports.registerUser = async (username, email, password, role) => {
    try {
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return {
                result: {},
                message: 'Email already exists. Please use a different email',
                status: 'error',
                responseCode: 400
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userSchema.create({ username, email, password: hashedPassword , role}); 

        sendMail(email, 'Register Successful', `Welcome back, ${email}!`);

        return {
            result: { email, username }, 
            message: 'User created successfully',
            status: 'success',
            responseCode: 201
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            result: error.message,
            message: 'Internal server error',
            status: 'error',
            responseCode: 500
        };    
    }
};

exports.loginUser = async (email, password) => {
    try {
        const user = await userSchema.findOne({ email });
        if (!user) {
            return {
                result: {},
                message: 'User not found',
                status: 'error',
                responseCode: 400
            };
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return {
                result: {},
                message: 'Invalid credentials',
                status: 'error',
                responseCode: 400
            };
        }

        const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, process.env.SECRET_KEY);

        sendMail(email, 'Login Successful', `Welcome back, ${user.email}!`);

        return {
            result: { user_email: user.email, username: user.username, role: user.role, token, isAdmin: user.isAdmin },
            message: 'Login successful',
            status: 'success',
            responseCode: 200
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
