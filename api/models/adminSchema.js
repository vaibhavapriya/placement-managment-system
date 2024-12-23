const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
    accessLevel: { type: String, default: 'Full' }, // Additional admin details if needed
});

module.exports = mongoose.model('Admin', adminSchema);
