const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing' },
    status: { type: String, enum: ['Submitted', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Hired'], default: 'Submitted' },    
    feedback:{type: String }, // Feedback for students
});
module.exports = mongoose.model('Application', applicationSchema);
