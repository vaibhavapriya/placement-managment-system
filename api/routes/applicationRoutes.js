const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const applicationController = require('../controllers/applicationController');
const { validateToken } = require('../middlewares/validateToken');
const { getApplicationByJob, getApplicationsByStudent, updateApplication ,getApplicationById } = require('../controllers/applicationController');

// Apply for a job
router.post('/:id', validateToken, upload.single('resume'), applicationController.applyForJob);
router.get('/byJob/:jobId', validateToken, getApplicationByJob );
router.get('/byUser/:userId', validateToken, getApplicationsByStudent );
router.put("/applications/:applicationId", validateToken, updateApplication);
router.get('/applications/:applicationId', getApplicationById);


module.exports = router;
