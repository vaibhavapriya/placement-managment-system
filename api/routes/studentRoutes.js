const express = require('express');
const {
    viewJobs,
    viewProfile,
    updateProfile,
    applyJob,
    scheduleInterview,
    viewAppliedJobs,
    viewFeedbacks,
} = require('../controllers/studentController');
const { verifyToken } = require('../middleware/verifyToken');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Student-Specific Routes
router.get('/jobs', verifyToken, checkRole(['Student']), viewJobs);
router.get('/profile', verifyToken, checkRole(['Student']), viewProfile);
router.put('/profile', verifyToken, checkRole(['Student']), updateProfile);
router.get('/applied-jobs', verifyToken, checkRole(['Student']), viewAppliedJobs);
router.post('/apply-job/:jobId', verifyToken, checkRole(['Student']), applyJob);
router.post('/schedule-interview', verifyToken, checkRole(['Student']), scheduleInterview);
router.get('/feedbacks', verifyToken, checkRole(['Student']), viewFeedbacks);

module.exports = router;
