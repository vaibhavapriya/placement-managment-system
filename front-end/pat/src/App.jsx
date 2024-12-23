import react, { useState } from 'react'
import './App.css'

function App() {

  return (
    <>
      <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/student" element={<StudentHome />} />
                <Route path="/company" element={<CompanyHome />} />
                <Route path="/admin" element={<AdminHome />} />
            </Routes>
      </Router>
    </>
  )
}

export default App
