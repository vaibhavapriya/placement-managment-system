const JobListing = require('../models/jobListingSchema');  // Job listing model
const User = require('../models/User');  // User model

// Create a job listing
exports.createJob = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const newJob = new JobListing({
            title,
            description,
            location,
            companyId: req.user.companyId, // Company created by the logged-in user
            createdBy: req.user._id, // User who is logged in and creating the job
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Edit a job listing
exports.editJob = async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const job = await JobListing.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job listing not found' });
        }

        // Update the job listing if authorized
        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.updatedAt = Date.now();

        await job.save();
        res.status(200).json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a job listing
exports.deleteJob = async (req, res) => {
    try {
        const job = await JobListing.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job listing not found' });
        }

        // Delete the job listing if authorized
        await job.remove();
        res.status(200).json({ message: 'Job listing deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
d