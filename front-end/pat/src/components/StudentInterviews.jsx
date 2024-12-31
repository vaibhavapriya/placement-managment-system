import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePatContext } from '../context/PatContext';
import { Link } from 'react-router-dom';
import FormSlot from './FormSlot';

function StudentInterviews() {
  const { state, dispatch } = usePatContext();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const studentId = state.id;  // Assuming state.id is the userId of the student
  console.log(studentId);

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
        if (!token) {
          setError('You must be logged in to view your interviews.');
          setLoading(false);
          return;
        }

        // Assuming the API endpoint is `/interviews/:userId` to fetch interviews for a student
        const response = await axios.get(`http://localhost:5000/interviews/byStudent/${studentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setInterviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interviews:', error);
        setError('Failed to fetch interviews. Please try again later.');
        setLoading(false);
      }
    };

    fetchInterviews();
  }, [studentId,isModalOpen]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {interviews.length === 0 && <div>No scheduled interviews found.</div>}
      {isModalOpen && selectedInterviewId && (
        <FormSlot interviewId={selectedInterviewId} onClose={closeModal} />
      )}
      {interviews.map((interview) => (
        <div key={interview._id} className="bg-white rounded-lg shadow-md p-4">
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
              <div>
                <strong>Slot Booked:</strong> {new Date(interview.slotBooked.startTime).toLocaleString()}
              </div>
            </div>
          ) : (
            <div>
              <div>
                <strong>Interview Date:</strong> {new Date(interview.interviewDate).toLocaleString()}
              </div>
              <button
                onClick={() => openModal(interview._id)} // Fix here: pass a function
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
