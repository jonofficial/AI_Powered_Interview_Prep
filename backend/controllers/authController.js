const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// gerate JWT token
const generateToken = (id) => {
    return jwt.sign({ id, userId }, process.env.JWT_SECRET, {expiresIn: '7d',});
};

const registerUser = async (req, res) => {
};

const loginUser = async (req, res) => {
};

const getUserProfile = async (req, res) => {
};