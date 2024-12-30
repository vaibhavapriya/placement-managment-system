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
      student: student._id,
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
    res.status(500).json({ error: 'Internal server error' });
  }
};
