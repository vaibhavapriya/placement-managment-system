const Application = require('../models/applicationSchema');
const Student = require('../models/studentSchema');
const JobListing = require('../models/jobListingSchema');

// exports.applyForJob = async (req, res) => {
//     try {
//         const { jobId } = req.body; // Job ID to apply for
//         const studentId = req.user.id; // Student's user ID from token

//         // Validate the inputs
//         if (!jobId) {
//             return res.status(400).json({ message: 'Job ID is required.' });
//         }

//         // Find the student record
//         const student = await Student.findOne({ userid: studentId });
//         if (!student) {
//             return res.status(404).json({ message: 'Student not found.' });
//         }

//         // Find the job listing
//         const job = await JobListing.findById(jobId);
//         if (!job) {
//             return res.status(404).json({ message: 'Job not found.' });
//         }

//         // Check if the student has already applied for the job
//         const existingApplication = await Application.findOne({ student: student._id, job: job._id });
//         if (existingApplication) {
//             return res.status(400).json({ message: 'You have already applied for this job.' });
//         }

//         // Create a new application
//         const newApplication = new Application({
//             student: student._id,
//             job: job._id,
//         });
//         const savedApplication = await newApplication.save();

//         // Add the application ID to the student's applications array
//         student.applications.push(savedApplication._id);
//         await student.save();

//         // Add the application ID to the job's applications array
//         job.applications.push(savedApplication._id);
//         await job.save();

//         res.status(201).json({ message: 'Application submitted successfully.', application: savedApplication });
//     } catch (error) {
//         console.error('Error applying for job:', error);
//         res.status(500).json({ message: 'Server error.', error: error.message });
//     }
// };
exports.applyForJob  = async (req, res) => {
    try {
        const { jobId, resume, candidateNote } = req.body; // Extract data from the request body
        const studentId = req.user.id;// Assuming middleware sets `req.user`

        // Validate the inputs
        const job = await JobListing.findById(jobId); 
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        // Find the student record
        const student = await Student.findOne({ userid: studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        if (!jobId|| !resume || !candidateNote) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newApplication = {
            student: studentId, // Assuming currentUser is available via middleware
            job: jobId,
            status: 'applied',
            resume: resume,
            candidateNote: candidateNote,
            appliedAt: new Date(), // Optional: Track when the application was submitted
        };
        // Check if the student has already applied for the job
        const existingApplication = await Application.findOne({ student: student._id, job: job._id });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }


        // Save the new application to the database
        const application = new Application(newApplication);
        await application.save();
 
        // Add the application ID to the student's applications array
        student.applications.push(application._id);
        await student.save();

        // Add the application ID to the job's applications array
        job.applications.push(application._id);
        await job.save();

        return res.status(201).json({
            message: 'Application submitted successfully',
            application,
        });
    } catch (error) {
        console.error('Error creating application:', error);
        return res.status(500).json({
            error: 'Internal Server Error. Please try again later.',
        });
    }
};