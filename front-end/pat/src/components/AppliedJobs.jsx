import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePatContext } from '../context/PatContext';

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

        const response = await axios.get(`http://localhost:5000/app//byUser/${studentId}`, {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((application) => (
        <div key={application._id} className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-xl font-bold text-blue-600">{application.job.title}</h3>
          <p className="text-sm text-gray-500">{application.job.companyName}</p>
          <p className="text-sm text-gray-500">{application.job.companyEmail}</p>
          <p className="mt-2 text-gray-700">{application.job.description}</p>
          <div className="mt-4">
            <span
              className={`text-sm font-medium py-1 px-2 rounded ${
                application.status === 'applied'
                  ? 'bg-blue-100 text-blue-600'
                  : application.status === 'Reviewed'
                  ? 'bg-yellow-100 text-yellow-600'
                  : application.status === 'Shortlisted'
                  ? 'bg-green-100 text-green-600'
                  : application.status === 'Interview Scheduled'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {application.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppliedJobs;
