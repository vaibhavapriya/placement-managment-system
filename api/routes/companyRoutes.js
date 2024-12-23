const express = require('express');
const {
    viewJobs,
    viewApplicants,
    addJob,
    scheduleInterview,
    shortlistApplicant,
    addFeedback,
    viewApplicantProfile,
    generateVideoCallLink,
} = require('../controllers/companyController');
const { verifyToken } = require('../middleware/verifyToken');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();

// Company-Specific Routes
router.get('/jobs', verifyToken, checkRole(['Company']), viewJobs);
router.get('/applicants/:jobId', verifyToken, checkRole(['Company']), viewApplicants);
router.post('/add-job', verifyToken, checkRole(['Company']), addJob);
router.post('/schedule-interview', verifyToken, checkRole(['Company']), scheduleInterview);
router.post('/shortlist/:studentId', verifyToken, checkRole(['Company']), shortlistApplicant);
router.post('/feedback/:studentId', verifyToken, checkRole(['Company']), addFeedback);
router.get('/applicant-profile/:studentId', verifyToken, checkRole(['Company']), viewApplicantProfile);
router.post('/generate-videocall', verifyToken, checkRole(['Company']), generateVideoCallLink);

module.exports = router;
