import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePatContext } from '../../context/PatContext';
import { Link } from 'react-router-dom';

function AppliedJobs() {
  const { state, dispatch } = usePatContext();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = state.id;
  console.log(studentId)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view your applications.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/app/byUser/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setApplications(response.data.applications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchApplications();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
<div className="">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Adjusted gap for better spacing */}
    {applications.length === 0 && <div>No applications found.</div>}
    {applications.map((application) => (
      <div
        key={application._id}
        className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto space-y-4 bg-[#F7F4FF] transition-transform duration-300 hover:scale-105 hover:shadow-xl" // Hover effects and spacing
      >
        {/* Job Title */}
        <div className="text-2xl font-semibold text-[#3D52A0] hover:text-black transition-colors duration-300">
          <Link to={`/job/${application.job._id}`}>{application.job.title}</Link>
        </div>

        {/* Company Info */}
        <p className="text-lg text-[#4A4A6A] mt-2">{application.job.companyName}</p>
        <p className="text-lg text-[#4A4A6A]">{application.job.companyEmail}</p>

        {/* Description */}
        <p className="mt-4 text-lg text-gray-700">{application.job.description}</p>
        <div className="mb-2 text-blue-500">
          <Link to={`/app/${application._id}`} className="text-sm hover:text-blue-700">
            more info
          </Link>
        </div>

        {/* Status */}
        <div className="mt-4">
          <span
            className={`text-sm font-medium py-1 px-3 rounded-full ${
              application.status === "applied"
                ? "bg-blue-100 text-blue-600"
                : application.status === "Reviewed"
                ? "bg-yellow-100 text-yellow-600"
                : application.status === "Shortlisted"
                ? "bg-green-100 text-green-600"
                : application.status === "Interview Scheduled"
                ? "bg-indigo-100 text-indigo-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {application.status}
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

  );
}

export default AppliedJobs;
