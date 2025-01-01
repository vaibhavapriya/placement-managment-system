const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { createZoomMeeting } = require('../services/zoomService');
const Interview = require('../models/interviewSchema');
const Slot = require('../models/slotScheme'); // Assuming Slot is another model for interview slots
const JobListing = require('../models/jobListingSchema'); // Assuming this model exists for job listings
const Application = require('../models/applicationSchema'); // Assuming this model exists for applications
const Student = require('../models/studentSchema'); // Assuming this model exists for students

// Set up transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, // Use your email password or OAuth token
  },
  
});

// Function to send interview scheduled email
const sendInterviewScheduledEmail = async (studentEmail, interviewDetails) => {
  const { jobTitle, studentName, interviewDate, interviewTime, interviewType, interviewLink, interviewLocation } = interviewDetails;

  const subject = `Interview Scheduled for ${jobTitle}`;
  const text = `
    Dear ${studentName},

    Your interview for the job position of ${jobTitle} has been scheduled.

    Interview Details:
    - Date: ${interviewDate}
    - Time: ${interviewTime}
    - Interview Type: ${interviewType}
    - ${interviewType === 'virtual' ? 'Video Call Link: ' + interviewLink : 'Location: ' + interviewLocation}

    Please make sure to be available at the scheduled time.

    Best regards,
    The Recruitment Team
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: studentEmail,
      subject: subject,
      text: text,
      
    });
    console.log('Interview scheduled email sent to', studentEmail);
  } catch (err) {
    console.error('Error sending interview scheduled email:', err);
  }
};

// Function to send reminder email
const sendReminderEmail = async (studentEmail, interviewDetails) => {
  const { jobTitle, studentName, interviewDate, interviewTime, interviewType, interviewLink, interviewLocation } = interviewDetails;

  const subject = `Reminder: Interview for ${jobTitle} in 1 Hour`;
  const text = `
    Dear ${studentName},

    This is a reminder that your interview for the job position of ${jobTitle} is scheduled in 1 hour.

    Interview Details:
    - Date: ${interviewDate}
    - Time: ${interviewTime}
    - Interview Type: ${interviewType}
    - ${interviewType === 'virtual' ? 'Video Call Link: ' + interviewLink : 'Location: ' + interviewLocation}

    Please make sure to be available at the scheduled time.

    Best regards,
    The Recruitment Team
  `;

  try {
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: studentEmail,
      subject: subject,
      text: text,
    });
    console.log('Reminder email sent to', studentEmail);
  } catch (err) {
    console.error('Error sending reminder email:', err);
  }
};

// Function to schedule interview
exports.scheduleInterview = async (req, res) => {
  try {
    const { jobId, slots, type, location, allowBooking, students, startTime, duration, agenda } = req.body;

    if (!jobId || !slots || !type || !students || students.length === 0) {
      return res.status(400).json({ message: "Missing required fields or no students selected." });
    }

    if (!["virtual", "in-person"].includes(type)) {
      return res.status(400).json({ message: "Invalid interview type." });
    }

    if (!slots || slots.length === 0) {
      return res.status(400).json({ message: "Slots are required and cannot be empty." });
    }

    // Zoom link generation
    let zoomLink = null;
    if (type === "virtual") {
      try {
        zoomLink = await createZoomMeeting({
          topic: 'Candidate Interview',
          startTime: slots[0]?.startTime || startTime, // Earliest slot or provided start time
          duration: duration || 60,
          agenda: agenda || 'Interview with candidate',
        });
        console.log('Zoom Meeting Link:', zoomLink);
      } catch (error) {
        console.error('Error in scheduleInterview:', error.message);
        return res.status(500).json({ message: 'Failed to schedule Zoom interview' });
      }
    }

    // Create slots
    const createdSlots = [];
    try {
      for (let slot of slots) {
        const newSlot = new Slot({
          job: jobId,
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
          status: allowBooking ? 'open' : 'booked',
        });
        const savedSlot = await newSlot.save();
        createdSlots.push(savedSlot._id);
      }
    } catch (err) {
      console.error("Error creating slots:", err.message);
      return res.status(500).json({ message: "Error creating slots." });
    }

    // Determine earliest slot time
    const interviewDate = new Date(
      Math.min(...slots.map((slot) => new Date(slot.startTime)))
    );

    const errors = [];
    for (let studentData of students) {
      try {
        const { student, _id: applicationId } = studentData;
        const interview = new Interview({
          job: jobId,
          student: student.userid,
          application: applicationId,
          interviewType: type,
          interviewDate,
          slots: createdSlots,
          slotBooked: allowBooking ? null : createdSlots[0],
          location: type === "in-person" ? location : undefined,
          url: type === "virtual" ? zoomLink : undefined,
          status: "Scheduled",
        });
        const savedInterview = await interview.save();

        await JobListing.findByIdAndUpdate(jobId, { $push: { interviews: savedInterview._id } });
        await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled', $push: { interviews: savedInterview._id } });
        await Student.findOneAndUpdate(
          { userid: student.userid },
          { $push: { interviews: savedInterview._id } },
          { new: true }
        );

        // Send email
        await sendInterviewScheduledEmail(student.email, {
          jobTitle: "Job Title",
          studentName: student.name,
          interviewDate: interviewDate.toLocaleDateString(),
          interviewTime: interviewDate.toLocaleTimeString(),
          interviewType: type,
          interviewLink: zoomLink,
          interviewLocation: location,
        });

        const reminderTime = new Date(interviewDate.getTime() - 60 * 60 * 1000);
        cron.schedule(`${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`, async () => {
          await sendReminderEmail(student.email, {
            jobTitle: "Job Title",
            interviewDate: interviewDate.toLocaleDateString(),
            interviewTime: interviewDate.toLocaleTimeString(),
          });
        });
      } catch (err) {
        errors.push({ student: studentData.student?.userid, error: err.message });
      }
    }

    if (errors.length > 0) {
      return res.status(207).json({ message: "Partial success", errors });
    }

    res.status(201).json({ message: "Interviews scheduled successfully" });
  } catch (err) {
    console.error("Unexpected error:", err.message);
    // Ensure response is only sent once
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

