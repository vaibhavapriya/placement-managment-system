const express = require("express");
const { scheduleInterview, bookSlot, sendNotifications, getUpcomingInterviews } = require("../controllers/interviewController");
const router = express.Router();

// Company schedules an interview
router.post("/schedule", scheduleInterview);

// Student books a slot
router.post("/book", bookSlot);

// Fetch upcoming interviews
router.get("/upcoming", getUpcomingInterviews);

module.exports = router;
