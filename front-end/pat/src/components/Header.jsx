import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePatContext } from '../context/PatContext';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';


function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state, dispatch } = usePatContext();
  const navigate = useNavigate(); // To navigate to login page

  // Handle Logout
  const handleLogout = () => {
      //axios to auth/logout 
      dispatch({
        type: 'SET_USER',
        payload: {  } ,
    });
      navigate('/'); // Redirect to login page
  };

  // Handle Profile Sidebar Toggle
  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar visibility
  };

  return (
    <div>
    <div className="fixed top-0 left-0 flex justify-between items-center w-full h-16 bg-blue-500 p-4 text-white">
      {/* Left section: You can add logo or other items here */}
      <div>
        <button onClick={toggleSidebar}
             className="hover:bg-blue-800 p-2 rounded-lg transition duration-300"
        >
          Profile
        </button>
      </div>
      <div className="text-xl font-bold">App Logo</div>

      {/* Right section: Logout and Profile */}
      <div className="flex space-x-4">
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition duration-300"
                >
                    LogOut
                </button>
      </div>
      
    </div>
      {/* Profile Sidebar */}
      {isSidebarOpen && (<Profile />)}
    </div>
  )  
}

export default Header