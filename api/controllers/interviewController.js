const Interview = require("../models/Interview");
const nodeMailer = require("nodemailer");
const cron = require("node-cron");


exports.scheduleInterview = async (req, res) => {
  try {
    const { companyId, jobId, format, location, link, date, timeSlots } = req.body;

    const interview = new Interview({
      companyId,
      jobId,
      format,
      location,
      link,
      date,
      timeSlots,
    });

    await interview.save();

    res.status(201).json({ message: "Interview scheduled successfully", interview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.bookSlot = async (req, res) => {
    try {
      const { studentId, interviewId, bookedSlot } = req.body;
  
      const interview = await Interview.findById(interviewId);
      if (!interview) return res.status(404).json({ message: "Interview not found" });
  
      // Ensure the slot is available
      if (!interview.timeSlots.includes(bookedSlot)) {
        return res.status(400).json({ message: "Slot not available" });
      }
  
      interview.studentId = studentId;
      interview.bookedSlot = bookedSlot;
      interview.timeSlots = interview.timeSlots.filter((slot) => slot !== bookedSlot);
  
      await interview.save();
  
      res.status(200).json({ message: "Slot booked successfully", interview });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };

  // Example notification function
  exports.sendNotifications = async () => {
    // Use `node-cron` to schedule this job
    cron.schedule("0 9 * * *", async () => {
      const upcomingInterviews = await Interview.find({ date: { $gte: new Date() } });
  
      upcomingInterviews.forEach((interview) => {
        // Logic to send email reminders
      });
    });
  };
    
