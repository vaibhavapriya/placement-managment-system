const express = require('express');
const Application = require('../models/applicationSchema');
const JobListing = require('../models/jobListingSchema');
const User = require('../models/userSchema');
const Company =require('../models/companySchema')
const Interview = require('../models/interviewSchema');

const router = express.Router();

// Fetch dashboard metrics
router.get('/dashboard-metrics', async (req, res) => {
  try {

    console.log("Dashboard metrics route hit");
    const totalApplications = await Application.countDocuments();
    const hiredCount = await Application.countDocuments({ status: 'Hired' });
    const successRate = (hiredCount / totalApplications) * 100;
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const totalJobs = await JobListing.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const jobStats = await JobListing.aggregate([
      {
        $project: {
          title: 1,
          totalApplications: { $size: { $ifNull: ['$applications', []] } },
          totalInterviews: { $size: { $ifNull: ['$interviews', []] } },
        },
      },
    ]);
    console.log("Job Stats:", JSON.stringify(jobStats, null, 2));
    // Calculate the job status breakdown
    const appliedCount = await Application.countDocuments({ status: 'Applied' });
    const rejectedCount = await Application.countDocuments({ status: 'Rejected' });
    const scheduledCount = await Interview.countDocuments({ status: 'Scheduled' });
    const completedCount = await Interview.countDocuments({ status: 'Completed' });
    const cancelledCount = await Interview.countDocuments({ status: 'Cancelled' });

    res.json({
      totalApplications,
      hiredCount,
      successRate,
      totalStudents,
      totalJobs,
      totalCompanies,
      jobStats,
      appliedCount,
      rejectedCount,
      scheduledCount,
      completedCount,
      cancelledCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

module.exports = router;
