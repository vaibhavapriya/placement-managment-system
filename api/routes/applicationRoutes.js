const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isAuthorized } = require('../middlewares/isAuthorized');
const { validateToken } = require('../middlewares/validateToken');
const applicationController = require('../controllers/applicationController');
const { applyForJob } = require('../controllers/applicationController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply for a job
router.post('/:id', validateToken, applicationController.uploadResume, applicationController.applyForJob);

module.exports = router;