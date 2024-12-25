// Controllers/applicationController.js
const Application = require('../models/applicationSchema');

// Create a new application
exports.createApplication = async (req, res) => {
    try {
        const { jobId, resume, coverLetter } = req.body;
        const newApplication = new Application({
            student: req.user._id, // Assuming middleware sets `req.user`
            job: jobId,
            status: 'Submitted',
            resume,
            coverLetter,
        });
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ error: 'Server error while creating application' });
    }
};

// Get applications for a student
exports.getStudentApplications = async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id }).populate('job');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching applications' });
    }
};
