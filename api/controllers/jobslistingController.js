const JobListing = require('../models/jobListingSchema');  // Job listing model
const User = require('../models/userSchema');  // User model
const Company = require('../models/companySchema'); 

exports.createJob = async (req, res) => {
    try {
        const { title, description, package: jobPackage, location, requirements } = req.body;
        console.log('Request body:', req.body);
        console.log('User info from token:', req.user.id);

        // Find the company associated with the logged-in user
        const company = await Company.findOne({ userid: req.user.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Create the job listing
        const newJob = new JobListing({
            company: company,
            companyName: company.name,
            companyEmail: company.email,
            title,
            description,
            package: jobPackage,
            location,
            requirements,
            status: 'Open',
        });

        const savedJob = await newJob.save();

        // Add the job ID to the company's jobListings array
        company.jobListings.push(savedJob._id);
        await company.save();

        res.status(201).json({ message: 'Job created successfully.', job: savedJob });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.params.cuserid; // This is the User ID of the company

        // Fetch company details using User ID
        const company = await Company.findOne({ userid: companyId }).select('name email');
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }
        
        // Fetch jobs associated with the company
        const jobs = await JobListing.find({ company: companyId });
        if (!jobs.length) {
            return res.status(200).json({
              message: 'No jobs found for this company.',
              companyDetails: { name: company.name, email: company.email },
              jobs: [],
            });
          }

        res.status(200).json({
            companyDetails: {
                name: company.name,
                email: company.email,
            },
            jobs,
        });

    } catch (error) {
        console.error('Error fetching company jobs:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all job listing
exports.getAllJobs = async (req, res) => {
    try {
         // Fetch job listings.
         const jobs = await JobListing.find().sort({ createdAt: -1 });
        
         // Send back a successful response with the job listings
         res.status(200).json({ jobs });
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
