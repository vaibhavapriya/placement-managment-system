import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams  } from 'react-router-dom';

function ApplicationDetails() {
    const navigate = useNavigate();
  const { applicationId} = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log("appId" +applicationId);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/app/applications/${applicationId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setApplication(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching application details');
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (loading) {
    return <p>Loading application...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Application Details</h2>
      {application ? (
        <div>
          <p>Student Name: {application.student.name}</p>
          <p>Student Email: {application.student.email}</p>
          <p>Job Title: {application.job.title}</p>
          <p>Company Name: {application.job.companyName}</p>
          {/* Add other details you want to show */}
        </div>
      ) : (
        <p>No application found.</p>
      )}
    </div>
  );
}

export default ApplicationDetails;
