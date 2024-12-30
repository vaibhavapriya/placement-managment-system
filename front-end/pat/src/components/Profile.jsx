import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatContext } from '../Context/PatContext';
import EditProfile from './EditProfile';
import axios from 'axios';

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);  // State to hold the student profile data
  const { state, dispatch } = usePatContext();
  const id = state.id;
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch student profile using student ID (extracted from the token)
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        // Retrieve token from localStorage or context
        const token = localStorage.getItem('token');  // Assuming token is saved in localStorage after login
  
        // Send token in Authorization header
        const response = await axios.get(`http://localhost:5000/student/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Include token here
          }
        });
  
        setStudentProfile(response.data.student);  // Set the student profile to the state
      } catch (error) {
        console.error('Error fetching student profile:', error.response || error);
      }
    };
  
    fetchStudentProfile();
  }, [id]); // Trigger effect when userId in context changes

  if (!studentProfile) {
    return <div>Loading...</div>;  // Show loading while fetching data
  }

  return (
    <div className="fixed top-16 left-0 w-1/3 bg-[#EDE8F5] text-[#3D52A0] p-4" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Profile</h2>
        {isModalOpen && <EditProfile closeModal={closeModal} studentProfile={studentProfile}/>}
      </div>
      <div className="mt-4">
        {/* Edit Profile Button */}
        <button
          onClick={openModal}
          className="mt-4 bg-[#3D52A0] text-white px-4 py-2 rounded hover:bg-[#2E4292] transition duration-300"
        >
          Edit Profile
        </button>
        
        {/* Display student profile information */}
        <div className="mt-4">
          <p><strong>Name:</strong> {studentProfile.name}</p>
          <p><strong>Email:</strong> {studentProfile.email}</p>
          <p><strong>Grade:</strong> {studentProfile.grade}</p>
          <p><strong>Achievements:</strong> {studentProfile.achievements.join(', ')}</p>
          {studentProfile.resume && <p><strong>Resume:</strong> <a href={studentProfile.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>}
          <p><strong>Cover Letter:</strong> {studentProfile.coverLetter} </p>
          {studentProfile.transcripts && <p><strong>Transcripts:</strong> {studentProfile.transcripts} </p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;
