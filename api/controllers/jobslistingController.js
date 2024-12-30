const JobListing = require('../models/jobListingSchema');  // Job listing model
const User = require('../models/userSchema');  // User model
const Company = require('../models/companySchema'); 

exports.createJob = async (req, res) => {
    try {
        const { title, description, package: jobPackage, location, requirements, type} = req.body;
        console.log('Request body:', req.body);
        console.log('User info from token:', req.user.id);

        // Find the company associated with the logged-in user
        const company = await Company.findOne({ userid: req.user.id });
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Create the job listing with the company info
        const newJob = new JobListing({
            company: company.userid,
            companyName: company.name, // Set company name here
            companyEmail: company.email, // Set company email here
            title,
            description,
            package: jobPackage,
            location,
            requirements,
            type,
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

exports.editJob = async (req, res) => {
    try {
        const { title, description, package: jobPackage, location, requirements, status, type} = req.body;
        
        const jid=req.params.jobId;
        console.log(jid);
        // Find the job by ID
        const job = await JobListing.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Find the company associated with the logged-in user
        const company = await Company.findOne({ userid: req.user.id });

        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Update the job's details
        job.company = company.userid;
        job.companyName = company.name; // Set company name here
        job.companyEmail = company.email; // Set company email here
        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.package = jobPackage || job.package;
        job.requirements = requirements && Array.isArray(requirements) ? requirements : job.requirements; // Ensure requirements is an array
        job.status = status || job.status;
        job.type = type || job.type;
        job.updatedAt = Date.now();

        // Save the updated job
        await job.save();
        
        res.status(200).json(job); // Return the updated job details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await JobListing.findById(jobId);
        console.log(job)

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
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
