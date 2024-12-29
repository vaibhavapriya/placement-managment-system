const express = require('express');
const { validateToken } = require('../middlewares/validateToken');
const { checkRole } = require('../middlewares/checkRole')
const { editProfile, getProfile } = require('../controllers/studentController');

const router = express.Router();

router.put('/:id', validateToken, editProfile);

router.get('/:id', validateToken, getProfile);

module.exports = router;
