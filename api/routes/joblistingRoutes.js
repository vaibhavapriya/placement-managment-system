// jobListingRoutes.js
const express = require('express');
const router = express.Router();
const { createJob, editJob, deleteJob, getAll } = require('../controllers/jobslistingController');
const { isAuthorized } = require('../middlewares/isAuthorized');
const { validateToken } = require('../middlewares/validateToken')
// Create a job listing (only authorized users can do this)
router.post('/create', isAuthorized, createJob);

// Edit a job listing (only authorized users can do this)
router.put('/edit/:jobId', isAuthorized, editJob);

// Delete a job listing (only authorized users can do this)
router.delete('/delete/:jobId', isAuthorized, deleteJob);

router.get('/', validateToken, getAll)

module.exports = router;
