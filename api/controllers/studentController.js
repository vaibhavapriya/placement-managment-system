// Controllers/applicationController.js
const Application = require('../models/applicationSchema');
const Student = require('../models/studentSchema'); 
const User = require('../models/userSchema')

exports.editProfile = async (req, res) => {
    try {
      const userId  = req.user.id; // Assuming user ID is extracted from token
      const updatedProfile = req.body;
        console.log(updatedProfile);
      const student = await Student.findOneAndUpdate(
        { userid: userId },
        { $set: updatedProfile },
        { new: true }
      );
  
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', student });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  exports.getProfile = async (req, res) => {
    try {
        //const student = await Student.findOne({ userid: req.params.id }).populate('applications');
      const  userId  = req.user.id; // Assuming `userId` is extracted from the token by the `authenticate` middleware.
      

      const student = await Student.findOne({ userid: userId }); // Populate applications if needed..populate('applications')
      if (!student) {
        const user = await User.findById(userId)
        return res.status(200).json({ user });
        console.log(user)
      }
      
       
      res.status(200).json({student});
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Apply for a job
exports.createApplication = async (req, res) => {
    try {
        const { jobId, resume, coverLetter } = req.body;
        const newApplication = new Application({
            student: req.user._id, // Assuming middleware sets `req.user`
            job: jobId,
            status: 'Applied',
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

exports.getStudentProfile = async ( req, res) =>{};
