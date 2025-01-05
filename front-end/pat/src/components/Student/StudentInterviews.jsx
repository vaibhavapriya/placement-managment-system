import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePatContext } from '../../context/PatContext';
import { Link } from 'react-router-dom';
import FormSlot from '../FormSlot';

function StudentInterviews() {
  const { state, dispatch } = usePatContext();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  const openModal = (interviewId) => {
    setSelectedInterviewId(interviewId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const studentId = localStorage.getItem('userid');
        if (!token) {
          setError('You must be logged in to view your interviews.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`https://placement-managment-system.onrender.com/interviews/byStudent/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Check if the interviews array is empty or contains an error message
        if (response.data.message === "No interviews found for this student.") {
          setError('No interviews found for this student.');
          setInterviews([]); // Clear any existing interviews
        } else {
          setInterviews(response.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        
        // Handle the case where the error is due to no interviews
        if (error.response && error.response.status === 404) {
          setError('No interviews found for this student.');
        } else {
          setError('Failed to fetch interviews. Please try again later.');
        }

        setLoading(false);
      }
    };

    fetchInterviews();
  }, [isModalOpen]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.length === 0 && !error && <div>No scheduled interviews found.</div>}
      {isModalOpen && selectedInterviewId && (
        <FormSlot interviewId={selectedInterviewId} onClose={closeModal} />
      )}
      {interviews.map((interview) => (
        <div
          key={interview._id}
          className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg mx-auto space-y-4"
        >
          <h3 className="text-xl font-bold text-blue-600">
            <Link to={`/job/${interview.job._id}`}>{interview.job.title}</Link>
          </h3>
          <p className="text-sm text-gray-500">{interview.job.companyName}</p>
          <p className="text-sm text-gray-500">{interview.job.companyEmail}</p>

          <div className="mt-4">
            <span
              className={`text-sm font-medium py-1 px-2 rounded ${
                interview.status === 'Scheduled'
                  ? 'bg-indigo-100 text-indigo-600'
                  : interview.status === 'Completed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {interview.status}
            </span>
          </div>
          {interview.slotBooked ? (
            <div>
              <strong>Slot Booked:</strong> {new Date(interview.slotBooked.startTime).toLocaleString()}
            </div>
          ) : (
            <div>
              <strong>Interview Date:</strong> {new Date(interview.interviewDate).toLocaleString()}
              <button
                onClick={() => openModal(interview._id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Schedule Interview
              </button>
            </div>
          )}

          {interview.interviewType === 'in-person' && interview.location && (
            <div>
              <strong>Location:</strong> {interview.location}
            </div>
          )}

          {interview.interviewType === 'virtual' && interview.url && (
            <div>
              <strong>Join URL:</strong>{' '}
              <a href={interview.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                Open Link
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StudentInterviews;
