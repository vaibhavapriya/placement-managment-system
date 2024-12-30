import React, { useState } from "react";
import axios from "axios";

function Applications({ applications }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleView = (application) => {
    setSelectedApplication(application);
    setStatus(application.status);
    setFeedback(application.feedback || "");
  };

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
    <div>
      {applications.length > 0 ? (
        <div>
          <h3>Applications for this job:</h3>
          <ul>
            {applications.map((application) => (
              <li key={application._id}>
                <p>Student Name: {application.student.name}</p>
                <p>Email: {application.student.email}</p>
                <p>Grade: {application.student.grade}</p>
                <p>Status: {application.status}</p>
                <p>Note: {application.candidateNote}</p>
                <button onClick={() => handleView(application)}>View</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No applications found.</p>
      )}

      {selectedApplication && (
        <div className="update-form">
          <h4>Update Application</h4>
          <p>Student Name: {selectedApplication.student.name}</p>
          <div>
            <label>Status: </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="applied">Applied</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
          <div>
            <label>Feedback: </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            onClick={() => updateApplication(selectedApplication._id)}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Application"}
          </button>
          <button onClick={() => setSelectedApplication(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Applications;
