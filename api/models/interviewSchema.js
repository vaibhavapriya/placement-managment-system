const mongoose = require("mongoose");

const interviewSlotSchema = new mongoose.Schema({
  slotId : {type: mongoose.Schema.Types.ObjectId, auto: true, },
  jobId : { type: mongoose.Schema.Types.ObjectId, ref: "JobPosting", required: true, },
  studentId : { type: mongoose.Schema.Types.ObjectId, ref: "User", },
  companyId : { type: mongoose.Schema.Types.ObjectId,  ref: "Company",required: true, },
  startTime : { type: Date, required: true, },
  endTime : {  type: Date,  required: true,},
  videoCallLink : { type: String,  },
  status : {type: String, enum: ["available", "booked", "completed"], default: "available", },
});

module.exports = mongoose.model("InterviewSlot", interviewSlotSchema);
