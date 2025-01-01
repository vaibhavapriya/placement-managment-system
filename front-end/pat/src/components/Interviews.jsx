import React, { useState, useEffect } from "react";
import axios from "axios";

function Interviews({ companyId }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const companyId = localStorage.getItem('userid');
        const response = await axios.get(
          `http://localhost:5000/interviews/byCompany/${companyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInterviews(response.data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        alert("Failed to fetch interviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [companyId]);

  return (
    <div className="p-6 bg-[#F7F9FF] text-[#3D52A0] rounded-lg shadow-md">
      {loading ? (
        <p>Loading interviews...</p>
      ) : interviews.length > 0 ? (
        <div>
          <h3 className="text-2xl font-bold mb-4">Interviews for this company:</h3>
          <ul className="space-y-4">
            {interviews.map((interview) => (
              <li
                key={interview._id}
                className="border rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-sm text-[#3D52A0] font-semibold">
                  Student Name: {interview.student.name}
                </p>
                <p className="text-sm text-[#6B6A85]">Email: {interview.student.email}</p>
                <p className="text-sm text-[#6B6A85]">Job Title: {interview.job.title}</p>
                <p className="text-sm text-[#6B6A85]">Company: {interview.job.companyName}</p>
                <p className="text-sm font-medium text-[#8697C4]">Status: {interview.application.status}</p>
                <p className="text-sm text-[#6B6A85]">Note: {interview.application.candidateNote}</p>
                <p className="text-sm text-[#6B6A85]">Slot: {interview.slotBooked ? interview.slotBooked : "Not booked"}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-center text-[#8697C4]">No interviews found for this company.</p>
      )}
    </div>
  );
}

export default Interviews;
