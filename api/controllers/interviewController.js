const Slot = require('../models/slotScheme');
const Interview = require('../models/interviewSchema');
const JobListing = require('../models/jobListingSchema');
const Student = require('../models/studentSchema');
const Application = require('../models/applicationSchema');

exports.scheduleInterview = async (req, res) => {
  try {
    const { jobId, slots, type, videoCallLink, location, allowBooking, students } = req.body;

    // Log the incoming payload
    console.log("Received payload:", req.body);

    // Validate required fields
    if (!jobId || !slots || !type || !students || students.length === 0) {
      console.error("Missing required fields or no students selected.");
      return res.status(400).json({ message: "Missing required fields or no students selected." });
    }

    // Validate interview type
    if (!["virtual", "in-person"].includes(type)) {
      console.error("Invalid interview type:", type);
      return res.status(400).json({ message: "Invalid interview type." });
    }

    // Create Slots and Save them
    const createdSlots = [];
    for (let i = 0; i < slots.length; i++) {
      console.log(slots[i].startTime);
      try {
        const newSlot = new Slot({
          job: jobId,
          startTime: new Date(slots[i].startTime),
          endTime: new Date(slots[i].endTime),
          status: allowBooking ? 'open' : 'booked',
        });
        const savedSlot = await newSlot.save();
        createdSlots.push(savedSlot._id);
        console.log("Slot created:", savedSlot);
      } catch (err) {
        console.error("Error creating slot:", slots[i], err);
        return res.status(500).json({ message: "Error creating slot." });
      }
    }

    // Create Interviews for each student and assign slots
    for (let i = 0; i < students.length; i++) {
      const studentId = students[i]?.student?.userid; // Access the student ID
      const applicationId = students[i]?._id; // Application ID
      const student = students[i]?.student; // Full student object (for more info)
    
      // Debugging: Check if student and application details are valid
      console.log("applicationId", {applicationId});
    
      // Check for required fields
      if (!studentId || !applicationId) {
        console.error("Missing studentId or applicationId. Skipping student:", { studentId, applicationId });
        continue; // Skip invalid entries
      }
    
      // Validate that createdSlots has values and is not empty
      if (!createdSlots || createdSlots.length === 0) {
        console.error("No created slots available. Skipping interview creation for student:", { studentId });
        continue;
      }
    
      let slotBooked = null;
      if (!allowBooking) {
        slotBooked = createdSlots[i] || null; // Prevent out-of-bounds error if slots are missing
        console.log("Assigned slotBooked for student:", { studentId, slotBooked });
      }
    
      try {
        // Create the interview object
        const interview = new Interview({
          job: jobId,
          student: studentId,
          application: applicationId, // Reference the application
          interviewType: type,
          interviewDate: new Date(),
          slots: createdSlots,
          slotBooked,
          location: type === "in-person" ? location : undefined,
          url: type === "virtual" ? videoCallLink : undefined,
          status: "Scheduled",
        });
    
        // Save the interview
        const savedInterview = await interview.save();
    
        // Debug: Check if saved interview contains expected data
        if (!savedInterview || !savedInterview._id) {
          return res.status(500).json({ message: "Interview creation failed (missing _id)." });
        }
    
        // Update JobListing with the new interview
        await JobListing.findByIdAndUpdate(jobId, { $push: { interviews: savedInterview._id } });

        await Application.findByIdAndUpdate(applicationId, { $push: { interviews: savedInterview._id } });
        
        // Update Student with the new interview
        await Student.findOneAndUpdate(
          { userid: studentId }, // Match by `userid` for students
          { $push: { interviews: savedInterview._id } }, // Push interview to student's interview array
          { new: true } // Return updated student
        );
    
        // Update the application status to 'Shortlisted'
        const updatedApplication = await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled' }, { new: true });
      } catch (err) {
        // Log the specific error to understand what went wrong
        console.error("Error creating interview for student:", { studentId, applicationId }, err);
        return res.status(500).json({ message: "Error creating interview.", error: err.message });
      }
    }
    

    res.status(201).json({ message: "Interviews scheduled successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInterviewsByStudentId = async (req, res) => {
  try {
    const { userId } = req.params;  // Assuming the userId is passed as a route parameter

    // Find the student by userId
    const student = await Student.findOne({ userid: userId });  // We use `userid` here to find the student document

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Find all interviews associated with the student using the student's _id
    const interviews = await Interview.find({ student: student.userid})  
      .populate('job', 'title companyName')  // Populate job details (title and companyName)
      .populate('application', 'status resume candidateNote') 
      .populate('student', 'name email')
      .populate('slotBooked')  ;

    if (interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found for this student." });
    }

    return res.status(200).json(interviews);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getInterviewsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params; // Extract the companyId from request parameters

    console.log("Fetching job listings for company ID:", companyId);

    // Step 1: Find all job listings for the given company
    const jobListings = await JobListing.find({ company: companyId });

    console.log("Job Listings found:", jobListings);

    if (!jobListings || jobListings.length === 0) {
      return res.status(404).json({ message: "No job listings found for this company." });
    }

    // Step 2: Get all interviews associated with these job listings
    const jobIds = jobListings.map(job => job._id);
    console.log("Job IDs extracted:", jobIds);

    const interviews = await Interview.find({ job: { $in: jobIds } })
      .populate('job', 'title companyName') // Populate job title and company name
      .populate('student', 'name email') // Populate student details (name, email)
      .populate('application', 'status candidateNote resume feedback') // Populate application status and note
      .populate('slotBooked'); // Populate booked slot if any

    console.log("Interviews fetched:", interviews);

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found for this company." });
    }

    // Step 3: Return the list of interviews
    return res.status(200).json(interviews);
  } catch (err) {
    console.error("Error fetching interviews:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


exports.getSlotsForInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;  // Interview ID passed in the URL parameter
    console.log('Interview ID:', interviewId);

    // Step 1: Find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    // Step 2: Fetch all slots associated with this interview
    const slots = await Slot.find({ _id: { $in: interview.slots } }); // Find slots using the interview's slot IDs
    if (slots.length === 0) {
      return res.status(404).json({ message: "No slots available for this interview." });
    }

    // Step 3: Return the list of slots
    return res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

// Booking the slot for the interview
exports.bookSlotForInterview = async (req, res) => {
  try {
    //const { interviewId, slotId } = req.params;  // interviewId and slotId from the request params
    const { interviewId, slotId } = req.body;

    // Step 1: Find the interview
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    // Step 2: Find the slot
    const slot = await Slot.findById(slotId);
    if (!slot || slot.status !== "open") {
      return res.status(400).json({ message: "Slot is either invalid or already booked." });
    }

    // Step 3: Update the slot to 'booked' status
    slot.status = "booked";
    await slot.save();

    // Step 4: Update the interview's 'slotBooked' field with the selected slot
    interview.slotBooked = slotId;
    interview.status = "Scheduled"; // Assuming you want to mark it as Scheduled when the slot is booked
    await interview.save();

    return res.status(200).json({ message: "Slot successfully booked." });

  } catch (error) {
    console.error("Error booking slot:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.getInterviewSchedule = async (req, res) => {
  try {
    const { studentId, jobId } = req.query;  // Assume studentId and jobId are passed as query params

    // Validate inputs
    if (!studentId || !jobId) {
      return res.status(400).json({ message: 'Missing studentId or jobId.' });
    }

    // Fetch the interview schedule for the given studentId and jobId
    const interview = await Interview.findOne({
      student: studentId,
      job: jobId,
    })
      .populate('job') // Populates the job data
      .populate('student') // Populates the student data
      .populate('slots') // Populates the slots
      .exec();

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found for this student and job.' });
    }

    // Prepare the response data
    const interviewData = {
      interviewType: interview.interviewType,
      interviewDate: interview.interviewDate,
      location: interview.location,
      url: interview.url,
      status: interview.status,
      slots: interview.slots, // Will return the available slots
      slotBooked: interview.slotBooked, // Return the booked slot
    };

    // Send the interview schedule response
    res.status(200).json({
      message: 'Interview schedule retrieved successfully.',
      interview: interviewData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch Available Interviews
exports.getAvailableInterviews = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Find interviews that are scheduled but not booked yet by the student
    const interviews = await Interview.find({
      student: { $ne: studentId }, // Exclude the student who is already booked
      status: 'Scheduled', // Only scheduled interviews are available for booking
    }).populate('job', 'title description'); // Populate the job details for the interview

    if (!interviews) {
      return res.status(404).json({ message: 'No available interviews found.' });
    }

    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
exports.getInterviewSchedulesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;  // Get studentId from the request parameters

    if (!studentId) {
      return res.status(400).json({ message: 'Missing studentId.' });
    }

    // Fetch all interview schedules for the student
    const interviews = await Interview.find({ student: studentId })
      .populate('job')  // Populates the job data
      .populate('slots')  // Populates the slots
      .exec();

    if (!interviews.length) {
      return res.status(404).json({ message: 'No interviews found for this student.' });
    }

    // Map through interviews and structure the response
    const interviewSchedules = interviews.map(interview => ({
      interviewType: interview.interviewType,
      interviewDate: interview.interviewDate,
      location: interview.location,
      url: interview.url,
      status: interview.status,
      slots: interview.slots,
      slotBooked: interview.slotBooked,
    }));

    // Send the response with the interview schedules
    res.status(200).json({
      message: 'Interview schedules retrieved successfully.',
      interviewSchedules,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Book Interview
exports.bookInterview = async (req, res) => {
  try {
    const { studentId, interviewId } = req.body;

    // Find the interview by ID
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found.' });
    }

    // Check if the interview is already booked
    if (interview.status === 'Booked') {
      return res.status(400).json({ message: 'Interview already booked.' });
    }

    // Update the interview status to 'Booked'
    interview.status = 'Booked';
    interview.student = studentId;

    await interview.save();

    // Add the interview reference to the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    student.interviews.push(interviewId);
    await student.save();

    res.status(200).json({ message: 'Interview booked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getInterviewSchedulesByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;  // Get jobId from the request parameters

    if (!jobId) {
      return res.status(400).json({ message: 'Missing jobId.' });
    }
    const jobs = await JobListing.find({ company: companyId });

    // Fetch all interview schedules for the job
    const interviews = await Interview.find({ job: jobId })
      .populate('student')  // Populates the student data
      .populate('slots')  // Populates the slots
      .exec();

    if (!interviews.length) {
      return res.status(404).json({ message: 'No interviews found for this job.' });
    }

    // Map through interviews and structure the response
    const interviewSchedules = interviews.map(interview => ({
      student: interview.student.name,
      studentEmail: interview.student.email,
      interviewType: interview.interviewType,
      interviewDate: interview.interviewDate,
      location: interview.location,
      url: interview.url,
      status: interview.status,
      slots: interview.slots,
      slotBooked: interview.slotBooked,
    }));

    // Send the response with the interview schedules
    res.status(200).json({
      message: 'Interview schedules retrieved successfully.',
      interviewSchedules,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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

