const nodemailer = require('nodemailer');
const cron = require('node-cron');
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
    const { jobId, slots, type, videoCallLink, location, allowBooking, students } = req.body;

    // Validate required fields
    if (!jobId || !slots || !type || !students || students.length === 0) {
      return res.status(400).json({ message: "Missing required fields or no students selected." });
    }

    // Validate interview type
    if (!["virtual", "in-person"].includes(type)) {
      return res.status(400).json({ message: "Invalid interview type." });
    }

    // Create Slots and Save them
    const createdSlots = [];
    for (let i = 0; i < slots.length; i++) {
      try {
        const newSlot = new Slot({
          job: jobId,
          startTime: new Date(slots[i].startTime),
          endTime: new Date(slots[i].endTime),
          status: allowBooking ? 'open' : 'booked',
        });
        const savedSlot = await newSlot.save();
        createdSlots.push(savedSlot._id);
      } catch (err) {
        return res.status(500).json({ message: "Error creating slot." });
      }
    }

    // Create Interviews for each student and assign slots
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i]?.student?.userid;
      const applicationId = students[i]?._id;
      const student = students[i]?.student;

      if (!studentId || !applicationId) {
        continue;
      }

      let slotBooked = null;
      if (!allowBooking) {
        slotBooked = createdSlots[i] || null;
      }

      try {
        // Create the interview object
        const interview = new Interview({
          job: jobId,
          student: studentId,
          application: applicationId,
          interviewType: type,
          interviewDate: slots[0].startTime,
          slots: createdSlots,
          slotBooked,
          location: type === "in-person" ? location : undefined,
          url: type === "virtual" ? videoCallLink : undefined,
          status: "Scheduled",
        });

        // Save the interview
        const savedInterview = await interview.save();

        // Update JobListing with the new interview
        await JobListing.findByIdAndUpdate(jobId, { $push: { interviews: savedInterview._id } });

        // Update Application with the new interview
        await Application.findByIdAndUpdate(applicationId, { $push: { interviews: savedInterview._id } });

        // Update Student with the new interview
        await Student.findOneAndUpdate(
          { userid: studentId },
          { $push: { interviews: savedInterview._id } },
          { new: true }
        );

        // Update the application status to 'Shortlisted'
        await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled' }, { new: true });

        // Send the interview scheduled email to the student
        const interviewDetails = {
          jobTitle: "Job Title", // Replace with actual job title
          studentName: student.name,
          interviewDate: new Date(interview.interviewDate).toLocaleDateString(),
          interviewTime: new Date(interview.interviewDate).toLocaleTimeString(),
          interviewType: interview.interviewType,
          interviewLink: interview.url,
          interviewLocation: interview.location,
        };

        await sendInterviewScheduledEmail(student.email, interviewDetails);

        // Schedule reminder email 1 hour before the interview
        const interviewTime = new Date(interview.interviewDate);
        const reminderTime = new Date(interviewTime.getTime() - 60 * 60 * 1000); // 1 hour before

        cron.schedule(`${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`, async () => {
          await sendReminderEmail(student.email, interviewDetails);
        });

      } catch (err) {
        return res.status(500).json({ message: "Error creating interview.", error: err.message });
      }
    }

    res.status(201).json({ message: "Interviews scheduled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
