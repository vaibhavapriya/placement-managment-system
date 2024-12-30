import React, { useEffect, useState } from "react";
import axios from "axios";

function Applications({ applications }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleView = (application) => {
    setSelectedApplication(application);[applications]
    setStatus(application.status);
    setFeedback(application.feedback || "");
  };
  useEffect (() =>{
    setSelectedApplication(null);
  },[applications]);

  const updateApplication = async (applicationId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/app/applications/${applicationId}`,
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
      console.error("Error updating application:", error);
      alert("Failed to update application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F7F9FF] text-[#3D52A0] rounded-lg shadow-md">
  {applications.length > 0 ? (
    <div>
      <h3 className="text-2xl font-bold mb-4">Applications for this job:</h3>
      <ul className="space-y-4">
        {applications.map((application) => (
          <li
            key={application._id}
            className="border rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <p className="text-sm text-[#3D52A0] font-semibold">
              Student Name: {application.student.name}
            </p>
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
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h4 className="text-xl font-bold mb-4 text-[#3D52A0]">Update Application</h4>
      <p className="mb-4 text-sm text-[#6B6A85]">
        <span className="font-semibold text-[#3D52A0]">Student Name:</span>{" "}
        {selectedApplication.student.name}
      </p>
      <div className="mb-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-[#3D52A0]"
        >
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
          <option value="Hired">Hired</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="feedback"
          className="block text-sm font-medium text-[#3D52A0]"
        >
          Feedback:
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          disabled={loading}
          className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:border-[#7091E6]"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => updateApplication(selectedApplication._id)}
          disabled={loading}
          className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          {loading ? "Updating..." : "Update Application"}
        </button>
        <button
          onClick={() => setSelectedApplication(null)}
          className="px-4 py-2 bg-[#8697C4] text-white rounded hover:bg-[#6F7BAA] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

  );
}

export default Applications;
