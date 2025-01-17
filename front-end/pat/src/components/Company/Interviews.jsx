import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem("userid");
        const response = await axios.get(
          `https://placement-managment-system.onrender.com/interviews/byCompany/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched interviews:", response.data); // Log data structure
        setInterviews(response.data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        alert("Failed to fetch interviews.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInterviews();
  }, []);
  

  if (loading) {
    return <p>Loading interviews...</p>;
  }

  if (!interviews || interviews.length === 0) {
    return <p>No interviews found.</p>;
  }

  return (
    <div className="p-6 bg-[#F7F9FF] text-[#3D52A0] rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">Interviews</h3>
      <ul className="space-y-4">
        {console.log(interviews)}
        {interviews.map((interview) => (
        <li
          key={interview._id}
          className="border rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300 max-w-3xl mx-auto mb-4"
        >
          {/* Student Information */}
          
            <p className="text-lg text-[#3D52A0] font-semibold mb-2">
              {interview.student?.name || "N/A"}
            </p>
          
          <p className="text-sm text-[#6B6A85] mb-1">
            Email: {interview.student?.email || "N/A"}
          </p>

          {/* Job Information */}
          <p className="text-sm text-[#6B6A85] mb-1">
            Job Title: {interview.job?.title || "N/A"}
          </p>

          {/* Application Status */}
          <Link to={`/app/${interview.application._id}`}><p className="text-sm font-medium text-[#8697C4] mb-2 hover:text-blue-500 ">
            Application Status: {interview.application?.status || "N/A"}
          </p></Link>
          <p className="text-sm text-[#6B6A85] mb-1 ">
            Candidate Note: {interview.application?.candidateNote || "N/A"}
          </p>
          <a
            href={interview.application?.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline mb-2 block"
          >
            View Resume
          </a>

          {/* Company feedback */}
          <p className="text-sm text-[#6B6A85] mb-1">Company feedback:</p>
          <ul className="text-sm text-[#6B6A85] mb-2">
            {interview.application?.feedback.length > 0
              ? interview.application.feedback.map((feedbackItem, index) => (
                  <li key={index}>{feedbackItem}</li>
                ))
              : "N/A"}
          </ul>

          {/* Interview Information */}
          <p className="text-sm text-[#6B6A85] mb-1">
            Interview Type: {interview.interviewType || "N/A"}
          </p>
          <p className="text-sm text-[#6B6A85] mb-1">
            Interview Date:{" "}
            {new Date(interview.interviewDate).toLocaleString() || "N/A"}
          </p>
          <p className="text-sm text-[#6B6A85] mb-2">
            Status: {interview.status || "N/A"}
          </p>

          {/* Slot Information */}
          {interview.slotBooked ? (
            <>
              <p className="text-sm text-[#6B6A85] mb-1">
                Slot Start:{" "}
                {new Date(interview.slotBooked.startTime).toLocaleString() || "N/A"}
              </p>
              <p className="text-sm text-[#6B6A85] mb-2">
                Slot End:{" "}
                {new Date(interview.slotBooked.endTime).toLocaleString() || "N/A"}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#6B6A85] mb-2">No slot booked</p>
          )}

          {/* Location or URL */}
          {interview.location ? (
            <p className="text-sm text-[#6B6A85] mb-2">Location: {interview.location}</p>
          ) : interview.url ? (
            <a
              href={interview.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mb-2 block"
            >
              Join Virtual Meeting
            </a>
          ) : (
            <p className="text-sm text-[#6B6A85] mb-2">No location or URL available</p>
          )}
        </li>
      ))}

      </ul>

    </div>
  );
}

export default Interviews;

