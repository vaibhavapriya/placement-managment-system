const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const applicationController = require('../controllers/applicationController');
const { validateToken } = require('../middlewares/validateToken');

// Apply for a job
router.post('/:id', validateToken, upload.single('resume'), applicationController.applyForJob);

module.exports = router;
