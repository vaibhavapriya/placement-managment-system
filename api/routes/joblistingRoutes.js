// const express = require('express');
// const {
//     createJobListing,
//     getJobListingById,
//     getAllJobListings,
//     updateJobListing,
//     deleteJobListing,
// } = require('../controllers/jobListingController');


// const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// const router = express.Router();

// // Create a new job listing
// router.post('/', createJobListing);

// // Get a job listing by ID
// router.get('/:id', getJobListingById);

// // Get all job listings
// router.get('/', getAllJobListings);

// // Update a job listing
// router.put('/:id', updateJobListing);

// // Delete a job listing
// router.delete('/:id', deleteJobListing);
// // Only students can create or update applications
// router.post('/', verifyToken, checkRole(['Student']), createApplication);
// router.patch('/:id', verifyToken, checkRole(['Student']), updateApplication);

// // Admin access can be added to view all applications
// router.get('/', verifyToken, checkRole(['Admin']), async (req, res) => {
//     // Logic to get all applications
// });


// module.exports = router;
