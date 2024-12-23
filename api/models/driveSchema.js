const mongoose = require('mongoose');
const jobListingSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    title: String,
    description: String,
    package:Number,
    requirements: [String],
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
});
module.exports = mongoose.model('JobListing', jobListingSchema);