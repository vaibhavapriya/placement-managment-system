import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext';
import './App.css'

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Studenthome from './pages/Studenthome';
import Companyhome from './pages/Companyhome';
import Adminhome from './pages/Adminhome';

function App() {

  return (
    <>
    < AuthProvider>
      <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/student" element={<Studenthome />} />
                <Route path="/company" element={<Companyhome />} />
                <Route path="/admin" element={<Adminhome />} />
            </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
