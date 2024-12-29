import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatContext } from '../Context/PatContext';
import EditProfile from './EditProfile';

function Profile() {
  
const [isModalOpen, setIsModalOpen] = useState(false);
const { state, dispatch } = usePatContext();
const openModal = (job = null) => {
  //setSelectedJob(job);
  setIsModalOpen(true);
};

// Close the modal
const closeModal = () => {
  setIsModalOpen(false);
};

  return (    
    <div className="fixed top-16 left-0  w-1/3 bg-black bg-opacity-80 text-white p-4"  style={{ height: `calc(100vh - 64px)` }} >
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Profile</h2>
        {isModalOpen && <EditProfile closeModal={closeModal} />}
    </div>
    <div className="mt-4">
        {/* Add profile content here  i need a button to edit the student profile which on click open editprofile.jsx */}
        <button onClick={openModal}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"> edit profile </button>
        <p>Profile details go here...</p>
    </div>
    </div>
  )
}

export default Profile