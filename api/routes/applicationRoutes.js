const express = require('express');
const router = express.Router();
const { isAuthorized } = require('../middlewares/isAuthorized');
const { validateToken } = require('../middlewares/validateToken');
const { applyForJob } = require('../controllers/applicationController');

// Apply for a job
router.post('/apply', validateToken, applyForJob);

module.exports = router;