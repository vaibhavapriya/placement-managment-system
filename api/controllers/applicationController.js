const multer = require('multer');
const Student = require('../models/studentSchema');
const JobListing = require('../models/jobListingSchema');
const Application = require('../models/applicationSchema');
const path = require('path');
const fs = require('fs');


// File Upload Configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.uploadResume = upload.single('resume');

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { candidateNote, jobId } = req.body;
    const studentId = req.user.id; // Assuming middleware sets `req.user`
    console.log('Request Body:', req.body);  // Log the body to check its content
    console.log('File:', req.file);  // Log the uploaded file object

    // Validate jobId
    const job = await JobListing.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }

    // Find the student record
    const student = await Student.findOne({ userid: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    // Validate inputs
    if (!jobId || !req.file || !candidateNote) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Create a new application
    const newApplication = {
      student: studentId,
      job: jobId,
      status: 'applied',
      resume: req.file.path, // Save the URL of the uploaded resume in the database
      candidateNote: candidateNote,
      appliedAt: new Date(),
    };

    // Check if the student has already applied for the job
    const existingApplication = await Application.findOne({ student: student._id, job: job._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Save the application
    const application = new Application(newApplication);
    await application.save();

    // Update student and job with the new application
    student.applications.push(application._id);
    await student.save();

    job.applications.push(application._id);
    await job.save();

    return res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });

  } catch (error) {
    console.error('Error in applyForJob controller:', error);
    return res.status(500).json({
      error: 'Internal Server Error. Please try again later.',
    });
  }
};
