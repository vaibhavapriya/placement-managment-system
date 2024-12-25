// jobListingRoutes.js
const express = require('express');
const router = express.Router();
const { createJob, editJob, deleteJob } = require('../controllers/jobslistingController');
const { isAuthorized } = require('../middleware/authMiddleware');

// Create a job listing (only authorized users can do this)
router.post('/create', isAuthorized, createJob);

// Edit a job listing (only authorized users can do this)
router.put('/edit/:jobId', isAuthorized, editJob);

// Delete a job listing (only authorized users can do this)
router.delete('/delete/:jobId', isAuthorized, deleteJob);

module.exports = router;
