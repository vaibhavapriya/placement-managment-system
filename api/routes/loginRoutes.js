const express = require('express');
const { forgotPassword,  resetPassword } = require('../controllers/loginController');
const { login, signup, logout} = require('../controllers/userLoginController');
const { validateResetToken } = require('../middlewares/validateResetToken')
const { validateToken } = require('../middlewares/validateToken');
const { checkRole } = require('../middlewares/checkRole')

const router = express.Router();

// Public route for login
router.post('/login', login);

router.post('/signup', signup);

router.post('/logout', logout)

// Protected route for students
router.get('/student-data', validateToken, checkRole(['Student']), (req, res) => {
    res.send('Student-only data');
});

// Protected route for admins
router.get('/admin-data', validateToken, checkRole(['Admin']), (req, res) => {
    res.send('Admin-only data');
    //res.json({ message: 'Welcome, Student!', user: req.user });
});


//Protected route for admins
router.get('/company-data', validateToken, checkRole(['Company']), (req, res) => {
    res.send('Company-only data');
    //res.json({ message: 'Welcome, Student!', user: req.user });
});

// POST: Send password reset email
router.post('/forgot-password', forgotPassword);

//POST: Reset password (uses validateToken middleware)
router.post('/reset-password/:token', validateResetToken, resetPassword);

module.exports = router;
