const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    name: { type: String },
    email: { type: String },
    profile: { type: String }, // Company profile details
    jobListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobListing' }], // List of job postings
});

module.exports = mongoose.model('Company', companySchema);
