const Application = require('../models/applicationSchema');
const JobListing = require('../models/jobListingSchema');
const Student = require('../models/studentSchema');

exports.applyForJob = async (req, res) => {
  try {
    const { candidateNote, jobId } = req.body;
    const studentId = req.user.id; // Assuming middleware sets `req.user`
    console.log(candidateNote); // Log form data
    console.log(req.file);
    console.log('File uploaded:', req.file); // Debug uploaded file info

    // Validate jobId
    const job = await JobListing.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Validate student record
    const student = await Student.findOne({ userid: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure all inputs are provided
    if (!jobId || !req.file || !candidateNote) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    

    // Check if the student has already applied for this job
    const existingApplication = await Application.findOne({
      student: student.userid,
      job: job._id,
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create the new application
    const newApplication = {
      student: studentId,
      job: jobId,
      status: 'applied',
      resume: req.file.path, // Cloudinary URL
      candidateNote,
      appliedAt: new Date(),
    };

    const application = new Application(newApplication);
    await application.save();

    // Update student and job records
    student.applications.push(application._id);
    await student.save();

    job.applications.push(application._id);
    await job.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Error in applyForJob:', error);
    if (error.code === 11000) { // MongoDB duplicate key error code
      return res.status(400).json({ message: 'You have already applied for this job' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getApplicationByJob = async (req, res) => {
  const { jobId } = req.params;  // Get jobId from route parameters
  
  try {
    // Fetch the application by jobId
    const application = await Application.findOne({ job: jobId })
      .populate({
        path: 'student', // Populate student reference in the application
        select: 'name email grade achievements', // Select only relevant fields from student
      })
      .populate({
        path: 'job', // Populate job reference (if you want job details as well)
        select: 'title company description location', // Select only relevant fields from job
      });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found for the given jobId' });
    }
    console.log(applications)
    // Return the application details along with the populated student information
    res.status(200).json({ application });
  } catch (error) {
    console.error('Error fetching application details:', error);
    res.status(500).json({ error: 'An error occurred while fetching application details' });
  }
};

exports.getApplicationsByStudent = async (req, res) => {
  const { userId } = req.user.id;  // Get userId from route parameters
  
  try {
    // Fetch all applications by student userId
    const applications = await Application.find({ student: userId })
      .populate({
        path: 'student', // Populate student reference in the application
        select: 'name email grade achievements', // Select only relevant fields from student
      })
      .populate({
        path: 'job', // Populate job reference (if you want job details as well)
        select: 'title company description location', // Select only relevant fields from job
      });
    
    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: 'No applications found for the given student' });
    }
    console.log(applications)
    // Return the list of applications along with student and job details
    res.status(200).json({ applications });
  } catch (error) {
    console.error('Error fetching applications by student:', error);
    res.status(500).json({ error: 'An error occurred while fetching applications' });
  }
};
