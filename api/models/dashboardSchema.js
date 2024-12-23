const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
    totalStudents: Number,
    totalCompanies: Number,
    studentsPlaced: Number,
    offersAccepted: Number,
    successRate: Number,
});

module.exports = mongoose.model('Metrics', metricsSchema);
