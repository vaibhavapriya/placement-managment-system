const mongoose = require('mongoose');
const jobListingSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: String,
    companyEmail: String,
    title: String,
    description: String,
    package: Number,
    location:String,
    type: { type: String, enum: ['Fulltime', 'Internship'], default: 'Fulltime' }, 
    requirements: [String],
    status: { type: String, enum: ['Open', 'Close'], default: 'Open' },  
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    interviewSlots: [{type: mongoose.Schema.Types.ObjectId, ref: "InterviewSlot" }],
},{ timestamps: true });
module.exports = mongoose.model('JobListing', jobListingSchema);