const express = require('express');
const { scheduleInterview } = require('../controllers/interviewController');
const router = express.Router();

// POST: Schedule an interview
router.post('/schedule', scheduleInterview);

// GET: Get all interviews for a specific job
//router.get('/job/:jobId', getInterviewsForJob);

module.exports = router;
