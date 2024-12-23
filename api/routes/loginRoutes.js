const express = require('express');
const { forgotPassword,  resetPassword } = require('../controllers/loginController');
const { login, signup } = require('..controllers/userLoginController')
const validateToken = require('../middleware/validateToken');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

// Public route for login
router.post('/login', login);

router.post('/signup', signup);

// Protected route for students
router.get('/student-data', verifyToken, checkRole(['Student']), (req, res) => {
    res.send('Student-only data');
});

// Protected route for admins
router.get('/admin-data', verifyToken, checkRole(['Admin']), (req, res) => {
    res.send('Admin-only data');
    //res.json({ message: 'Welcome, Student!', user: req.user });
});


//Protected route for admins
router.get('/company-data', verifyToken, checkRole(['Company']), (req, res) => {
    res.send('Company-only data');
    //res.json({ message: 'Welcome, Student!', user: req.user });
});

// POST: Send password reset email
router.post('/forgot-password', forgotPassword);

//POST: Reset password (uses validateToken middleware)
router.post('/reset-password/:token', validateToken, resetPassword);

module.exports = router;
