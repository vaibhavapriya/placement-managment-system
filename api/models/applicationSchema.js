const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Submitted', 'Reviewed', 'Shortlisted', 'Interview Scheduled', 'Hired'], default: 'Submitted' },  
    resume: { type: String },  
    candidateNote: { type: String, maxlength: 1000 },
    appliedAt: {type: Date,default: Date.now, },
    feedback:{type: String }, // Feedback for students
});
module.exports = mongoose.model('Application', applicationSchema);
