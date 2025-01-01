const express = require('express');
const { getInterviewsByStudentId, bookSlotForInterview, getSlotsForInterview } = require('../controllers/interviewController');
const { scheduleInterview } = require('../controllers/scheduleInterview ')
const router = express.Router();

// POST: Schedule an interview
router.post('/schedule', scheduleInterview);
router.get('/byStudent/:userId', getInterviewsByStudentId);
router.get('/slots/:interviewId',getSlotsForInterview );
router.put('/slot/:interviewId/:slotId',bookSlotForInterview);

// GET: Get all interviews for a specific job
//router.get('/job/:jobId', getInterviewsForJob);

module.exports = router;
