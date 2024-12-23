const express = require('express');
const {
    createApplication,
    getApplicationById,
    getAllApplications,
    updateApplicationStatus,
    deleteApplication,
} = require('../controllers/applicationController');

const router = express.Router();

// Create a new application
router.post('/', createApplication);

// Get an application by ID
router.get('/:id', getApplicationById);

// Get all applications
router.get('/', getAllApplications);

// Update the status of an application
router.patch('/:id/status', updateApplicationStatus);

// Delete an application
router.delete('/:id', deleteApplication);

module.exports = router;
