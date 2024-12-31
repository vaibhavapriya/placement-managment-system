const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'JobListing', required: true }, // Reference to the job
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['open', 'booked'], default: 'open' }, // Slot status
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
