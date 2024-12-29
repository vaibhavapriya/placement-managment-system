const express = require('express');
const { validateToken } = require('../middlewares/validateToken');
const { checkRole } = require('../middlewares/checkRole')
const { createApplication, getStudentApplications } = require('../controllers/studentController');

const router = express.Router();

// Protected route for students
router.get('/student-data', validateToken, checkRole(['Student']));

router.post('/apply', validateToken, createApplication);
router.get('/my-applications', validateToken, getStudentApplications);

module.exports = router;
