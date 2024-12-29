import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatContext } from '../Context/PatContext';

function Profile() {
  return (    
    <div className="sticky top-0 right-0 w-1/3 bg-black bg-opacity-80 text-white p-4"  style={{ height: `calc(100vh - 64px)` }} >
    <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Profile</h2>
        {/* <button onClick={toggleSidebar} className="text-xl font-bold">&times;</button> */}
    </div>
    <div className="mt-4">
        {/* Add profile content here */}
        <p>Profile details go here...</p>
    </div>
    </div>
  )
}

export default Profile