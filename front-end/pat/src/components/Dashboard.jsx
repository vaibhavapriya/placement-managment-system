import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

    const handleLogout =async () => {
      try {
          const token = localStorage.getItem('token');
          const response = await axios.post('http://localhost:5000/auth/logout',{}, // Empty body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Set Bearer token
                },
            });
          console.log('Logout response:', response.data.message);
          localStorage.removeItem('token');
          navigate('/');
      } catch (error) {
          console.error('Logout error:', error.response?.data?.message || error.message);
      }
    };
  return (
    <>
      <div>
        <div></div>
        <div>
          <div>
            Profile icon
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default Dashboard