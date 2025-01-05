import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Applications({ applications }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const job = applications.length > 0 && applications[0].job ? applications[0].job.title : "No application submitted";


  const handleView = (application) => {
    setSelectedApplication(application);[applications]
    setStatus(application.status);
    setFeedback("");
  };
  useEffect (() =>{
    setSelectedApplication(null);
  },[applications]);

  const updateApplication = async (applicationId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://placement-managment-system.onrender.com/app/applications/${applicationId}`,
        { status, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Application updated successfully!");
      //refreshApplications(); // Refresh the application list
      setSelectedApplication(null); // Close update view
    } catch (error) {
      console.error("Error updating application:",error);
      alert("Failed to update application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F7F9FF] text-[#3D52A0] rounded-lg shadow-md w-100">
    {applications.length > 0 ? (
    <div>
      <h3 className="text-2xl font-bold mb-4">{ job}</h3>
      <ul className="space-y-4">
        {applications.map((application) => (
          <li
            key={application._id}
            className="border rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/app/${application._id}`}><p className="text-sm text-[#3D52A0] font-semibold">
              Student Name: {application.student.name}
            </p></Link>
            <p className="text-sm text-[#6B6A85]">Email: {application.student.email}</p>
            <p className="text-sm text-[#6B6A85]">Grade: {application.student.grade}</p>
            <p className="text-sm font-medium text-[#8697C4]">
              Status: {application.status}
            </p>
            <p className="text-sm text-[#6B6A85]">Note: {application.candidateNote}</p>
            <button
              onClick={() => handleView(application)}
              className="mt-4 px-4 py-2 bg-[#7091E6] text-white rounded hover:bg-[#5C81D4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <p className="text-lg text-center text-[#8697C4]">No applications found.</p>
  )}

  {selectedApplication && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            onClick={() => setSelectedApplication(null)} // Close modal on backdrop click
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 w-96"
              onClick={(e) => e.stopPropagation()} // Prevent modal closing when clicking inside
            >
              <h4 className="text-xl font-bold mb-4 text-[#3D52A0]">Update Application</h4>
              <p className="mb-4 text-sm text-[#6B6A85]">
                <span className="font-semibold text-[#3D52A0]">Student Name:</span> {selectedApplication.student.name}
              </p>

              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-[#3D52A0]">
                  Status:
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                  className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                >
                  <option value="applied">Applied</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Selected">Selected</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="feedback" className="block text-sm font-medium text-[#3D52A0]">
                  Feedback:
                </label>
                <textarea
                  id="feedback"
                  value={feedback} // This feedback is now empty by default
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={loading}
                  className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => updateApplication(selectedApplication._id, status, feedback)}
                  disabled={loading}
                  className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
                >
                  {loading ? "Updating..." : "Update Application"}
                </button>
                <button
                  onClick={() => setSelectedApplication(null)} // Close the modal
                  className="px-4 py-2 bg-[#8697C4] text-white rounded hover:bg-[#6F7BAA] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
</div>

  );
}

export default Applications;
