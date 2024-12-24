import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import './App.css'

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
                <Route path="/home" element={<HomePage/>}/>
                {/* <Route path="/student" element={<StudentHome />} />
                <Route path="/company" element={<CompanyHome />} />
                <Route path="/admin" element={<AdminHome />} /> */}
            </Routes>
      </Router>
    </AuthProvider>
    </>
  )
}

export default App
