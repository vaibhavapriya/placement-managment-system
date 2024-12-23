const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    profile: { type: String }, // Company profile details
    jobListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobListing' }], // List of job postings
});

module.exports = mongoose.model('Company', companySchema);
