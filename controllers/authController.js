const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const dotenv = require('dotenv');

// Mengakses variabel lingkungan jika menggunakan dotenv
dotenv.config();

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findByUsername(username);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({
                code: 404,
                status: 'error',
                message: 'User not found'
            });
        }

        // Perform password comparison
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                code: 401,
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.uuid, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '18h', // Token expires in 1 hour
        });

        res.json({
            code: 200,
            status: 'success',
            message: 'Login successful',
            token,
            user: { uuid: user.uuid, username: user.username, rolename: user.rolename }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            message: 'Internal server error'
        });
    }
};

exports.logout = async (req, res) => {
    // remove jwt token from client
    res.json({
        code: 200,
        status: 'success',
        message: 'Logout successful'
    });
};

exports.resetPassword = async (req, res) => {
    const { uuid } = req.params;
    const { newPassword } = req.body;

    try {
        // Check if user is super admin (implement your authorization logic here)

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password in database
        const updatedUser = await User.findByIdAndUpdate(uuid, { password: hashedPassword });

        if (!updatedUser) {
            return res.status(404).json({
                code: 404,
                status: 'error',
                message: 'User not found'
            });
        }

        res.json({
            code: 200,
            status: 'success',
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            code: 500,
            status: 'error',
            message: error.sqlMessage
        });
    }
};
