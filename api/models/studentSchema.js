const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    name: { type: String },
    email: { type: String },
    resume: { type: String }, // URL for resume file
    coverLetter: { type: String },
    grade: { type: Number },
    achievements: [String],
    transcripts: { type: String }, // URL for transcripts
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }], // List of applications
});

module.exports = mongoose.model('Student', studentSchema);
