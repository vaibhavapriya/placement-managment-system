// Add to jobRoutes
const { reviewApplication } = require('../controllers/companyController');
router.put('/review-application/:appId', validateToken, checkRole(['Company']), reviewApplication);
