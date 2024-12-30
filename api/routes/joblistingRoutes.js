// jobListingRoutes.js
const express = require('express');
const router = express.Router();
const { createJob, editJob, deleteJob, getAllJobs ,getCompanyJobs, getJobById} = require('../controllers/jobslistingController');
const { isAuthorized } = require('../middlewares/isAuthorized');
const { validateToken } = require('../middlewares/validateToken')
// Create a job listing (only authorized users can do this)
router.post('/newjob', validateToken, createJob);
// Get all jobs of a specific company
router.get('/c/:cuserid', validateToken, getCompanyJobs);
// Get all job listings
router.get('/', getAllJobs);
//Get job by id
router.get('/:jobId',validateToken, getJobById)
// Edit a job listing (only authorized users can do this)
router.put('/edit/:jobId', validateToken, editJob);

// Delete a job listing (only authorized users can do this)
router.delete('/delete/:jobId', isAuthorized, deleteJob);

module.exports = router;
