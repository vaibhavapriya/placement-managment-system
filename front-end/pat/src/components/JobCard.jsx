// src/components/JobCard.jsx

import React from 'react';

function JobCard({ job, onEdit, onViewApplications, onScheduleInterview }) {
  return (
    <div className="border border-[#E0E7FF] rounded-lg bg-white shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-semibold text-[#3D52A0]">{job.title}</h3>
      <p className="text-md text-[#6B6A85] mb-2">{job.description}</p>
      <p className="text-sm font-medium text-[#8697C4] mb-4">Status: {job.status}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {/* Edit Button */}
        <button
          onClick={() => onEdit(job)}
          className="px-5 py-2 bg-[#7091E6] text-white rounded-lg hover:bg-[#5C81D4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          Edit
        </button>
        {/* View Applications Button */}
        <button
          onClick={() => onViewApplications(job._id)}
          className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          View Applications
        </button>
        {/* Schedule Interview Button */}
        <button
          onClick={() => onScheduleInterview(job)}
          className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          Schedule Interview
        </button>
      </div>
    </div>
  );
}

export default JobCard;
