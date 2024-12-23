const express = require('express');
const { forgotPassword,  resetPassword } = require('../controllers/loginController');
const login = require('..controllers/userLoginController')
const validateToken = require('../middleware/validateToken');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// POST: Send password reset email
router.post('/forgot-password', forgotPassword);

//POST: Reset password (uses validateToken middleware)
router.post('/reset-password/:token', validateToken, resetPassword);

// Public route for login
router.post('/login', login);

// Protected route for students
router.get('/student-data', verifyToken, checkRole(['Student']), (req, res) => {
    res.send('Student-only data');
});

// Protected route for admins
router.get('/admin-data', verifyToken, checkRole(['Admin']), (req, res) => {
    res.send('Admin-only data');
});


module.exports = router;
