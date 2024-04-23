const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const User = require('../models/user');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.uuid, username: user.username }, config.jwtSecret, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = async (req, res) => {
    // No action needed for logout in stateless JWT authentication
    res.json({ message: 'Logout successful' });
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
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
