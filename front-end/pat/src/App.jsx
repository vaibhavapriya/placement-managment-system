import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import { PatProvider } from './context/PatContext' ;
import './App.css'

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Studenthome from './pages/Studenthome';
import Companyhome from './pages/Companyhome';
import Adminhome from './pages/Adminhome';
import JobDetails from './pages/JobDetails';

function App() {

  return (
    <>
    <PatProvider>
      <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/student/:id" element={<Studenthome />} />
                <Route path="/company/:id" element={<Companyhome />} />
                <Route path="/admin/:id" element={<Adminhome />} />
                <Route path="/job/:jobId" element={<JobDetails />} />
            </Routes>
      </Router>
    </PatProvider>
    </>
  )
}

export default App
