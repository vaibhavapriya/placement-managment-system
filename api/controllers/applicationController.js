const Application = require('../models/applicationSchema');
const JobListing = require('../models/jobListingSchema');
const Student = require('../models/studentSchema');
const mongoose = require('mongoose'); 
const Interview = require('../models/interviewSchema')

exports.applyForJob = async (req, res) => {
  try {
    const { candidateNote, jobId } = req.body;
    const studentId = req.user.id; // Assuming middleware sets `req.user`

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
  const { jobId } = req.params; // Extract the jobId from route parameters

  try {
    // Find applications for the given jobId
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'job', // Populate job reference from JobListing model
        select: 'title company description location', // Select relevant fields from job
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: 'No applications found for this job.' });
    }

    // Extract student IDs from applications
    const studentIds = applications.map(app => app.student);

    // Fetch student details for these userIds
    const students = await Student.find({ userid: { $in: studentIds } });

    // Combine applications with student details
    const populatedApplications = applications.map(app => {
      const student = students.find(s => s.userid.toString() === app.student.toString());
      return {
        ...app.toObject(),
        student: student
          ? {
              id:student._id,
              userid:student.userid,
              name: student.name,
              email: student.email,
              grade: student.grade,
              achievements: student.achievements,
            }
          : null, // Add null if no matching student is found
      };
    });

    res.status(200).json({ applications: populatedApplications });
  } catch (error) {
    console.error('Error fetching applications for job:', error);
    res.status(500).json({ error: 'An error occurred while fetching applications for the job.' });
  }
};

exports.getApplicationsByStudent = async (req, res) => {
  const userId = req.user.id;  // Get userId from route parameters
  
  try {
    // Fetch all applications by student userId
    const applications = await Application.find({ student: userId })
      .populate({
        path: 'student', // Populate student reference in the application
        select: 'name email grade achievements', // Select only relevant fields from student
      })
      .populate({
        path: 'job', // Populate job reference (if you want job details as well)
        select: 'title companyName companyEmail description location type', // Select only relevant fields from job
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

// Controller to get application by ID
exports.getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params; // Get the application ID from the request params
    console.log(applicationId)
    // Validate if the applicationId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: 'Invalid application ID.' });
    }

    // Fetch the application by ID and populate student
    const application = await Application.findById(applicationId)
      .populate('student','name')  
      .populate('job', 'title companyName companyEmail') ;

      const studentId = application.student._id; 
      const student = await Student.findOne({ userid: studentId },'name email resume coverLetter grade achievements transcripts');

      const applicationWithStudentInfo = {
        ...application.toObject(),
        studentInfo: student, // Add the full student object to the response
      };

    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }
    return res.status(200).json(applicationWithStudentInfo);

  } catch (err) {
    console.error('Error fetching application:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};


exports.updateApplication = async (req, res) => {
  const { applicationId } = req.params;
  const { status, feedback } = req.body;

  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Update the status and feedback fields
    application.status = status || application.status;
    // Push new feedback to the feedback array if provided
    if (feedback) {
      application.feedback.push(feedback); // This will add the feedback to the array
    }

    await application.save();

    res.status(200).json({
      message: "Application updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(500).json({ error: "An error occurred while updating the application." });
  }
};

