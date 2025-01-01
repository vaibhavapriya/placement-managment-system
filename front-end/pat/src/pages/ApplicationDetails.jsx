import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ApplicationDetails() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log("appId" + applicationId);

  useEffect(() => {
    const fetchApplication = async () => {
      setError(''); // Reset error before fetching
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect to login if no token
          return;
        }
        const response = await axios.get(`http://localhost:5000/app/applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplication(response.data);
      } catch (err) {
        setError('Error fetching application details');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Add a spinner or animation here for better UX
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-[#F7F9FF]">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-3xl">
        <div className="w-full flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#7091E6] hover:underline focus:outline-none mb-4"
          >
            Go Back
          </button>
        </div>
        {application ? (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-[#3D52A0] mb-6 border-b-2 border-[#7091E6] pb-2">
              {application.job?.title || 'Job Title Not Available'}
            </h2>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Company Name:</strong> {application.job?.companyName || 'Company Name Not Available'}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Company Email:</strong> {application.job?.companyEmail || 'Company email Not Available'}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Student Name:</strong> {application.student?.name || 'Student Name Not Available'}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Student Email:</strong> {application.studentInfo?.email || 'Student Email Not Available'}
            </p>
            <div>
              <a href={application.resume || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                {application.resume ? 'Resume' : 'Resume Not Available'}
              </a>
            </div>

            {/* Safely access grade and transcripts */}
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Grade:</strong> {application.studentInfo?.grade || 'Grade Not Available'}
            </p>
            <div>
              <a href={application.studentInfo.transcripts || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                {application.studentInfo?.transcripts ? 'Transcripts:' : 'Transcripts: Not Available'}
              </a>
            </div>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Transcripts:</strong> {application.studentInfo?.transcripts || 'Transcripts Not Available'}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Candidate Note:</strong> {application.candidateNote || 'Candidate Note Not Available'}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Status:</strong> {application.status || 'Status Not Available'}
            </p>

            {/* Render feedback if available */}
            {application.feedback?.length > 0 ? (
              <div>
                <strong className="text-[#3D52A0]">Feedback:</strong>
                <ul>
                  {/* Map through the feedback array and display each item */}
                  {application.feedback.map((item, index) => (
                    <li key={index} className="text-[#4A4A6A]">{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[#4A4A6A]">No feedback provided yet.</p>
            )}
          </div>
        ) : (
          <p>No application found.</p>
        )}
      </div>
    </div>
  );
}

export default ApplicationDetails;

