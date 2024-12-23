const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    resume: { type: String }, // URL for resume file
    coverLetter: { type: String },
    academicDetails: {
        grade: { type: Number },
        achievements: [String],
        transcripts: { type: String }, // URL for transcripts
    },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }], // List of applications
});

module.exports = mongoose.model('Student', studentSchema);
