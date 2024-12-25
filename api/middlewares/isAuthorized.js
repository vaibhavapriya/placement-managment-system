const JobListing = require('../models/jobListingSchema');

exports.isAuthorized = async (req, res, next) => {
    try {
        // Example: Check if the action involves a job listing (e.g., editing or deleting)
        if (req.params.jobId) {
            const jobListing = await JobListing.findById(req.params.jobId);
            if (!jobListing) {
                return res.status(404).json({ message: 'Job listing not found' });
            }

            // Check if the logged-in user is the owner of the job or is an admin
            if (jobListing.companyId.toString() === req.user.companyId.toString() || req.user.role === 'admin') {
                return next(); // Authorized user, proceed to the controller
            }

            return res.status(403).json({ message: 'Not authorized to perform this action' });
        }

        next(); // If no specific jobId, just proceed (default authorization)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
