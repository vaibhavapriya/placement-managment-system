// const express = require('express');
// const {
//     viewAllStudents,
//     viewAllCompanies,
//     updateJobListing,
//     managePlacementDrives,
//     recruitmentDashboard,
// } = require('../controllers/adminController');
// const { verifyToken } = require('../middleware/verifyToken');
// const { checkRole } = require('../middleware/roleMiddleware');

// const router = express.Router();

// // Admin-Specific Routes
// router.get('/students', verifyToken, checkRole(['Admin']), viewAllStudents);
// router.get('/companies', verifyToken, checkRole(['Admin']), viewAllCompanies);
// router.put('/update-job/:jobId', verifyToken, checkRole(['Admin']), updateJobListing);
// router.post('/manage-drives', verifyToken, checkRole(['Admin']), managePlacementDrives);
// router.get('/dashboard', verifyToken, checkRole(['Admin']), recruitmentDashboard);

// module.exports = router;
