const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true }, // Reference to the job
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the student
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  interviewType: { type: String, enum: ['virtual', 'in-person'], required: true }, // Interview type
  interviewDate: { type: Date, required: true }, // Date of interview
  slots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' }], // Array of available slot references
  slotBooked:{ type: mongoose.Schema.Types.ObjectId, ref: 'Slot' ,default: null },
  location: { type: String }, // Required if interviewType is 'in-person'
  url: { type: String },
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' }, // Interview status
  feedback: { type: String }, // Feedback from the interviewer
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);


