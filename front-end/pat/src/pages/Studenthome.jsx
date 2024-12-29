import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/Header';

function Studenthome() {
  //get student details using id(authContext) and store in contest @
  //GetAllJobs from services
  //Get appliedJobs usind id 
  //edit profile
  //apply jobs
  
  return (
    <div>
        <Header/>
        <div>All jobs map JobCard</div>
        <div>Applied jobs map jobCard</div>
    </div>
  )
}

export default Studenthome