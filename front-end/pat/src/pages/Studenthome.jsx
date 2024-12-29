import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import DriveCard from '../components/DriveCard';

function Studenthome() {
  //get student details using id(authContext) and store in contest @
  //GetAllJobs from services
  //Get appliedJobs usind id 
  //edit profile
  //apply jobs
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs ] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to post a job.');
            return;
        }
    const fetchJobs = async () => {
      try {
        // Replace this URL with the actual API endpoint
        const response = await axios.get(`http://localhost:5000/jobs/`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

        if (response.data.jobs) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };
    //fetch applied jobs
    fetchJobs();
  }, []);
  console.log(jobs);
  
  return (
    <div className=" min-h-screen">
        <Header/>
        <section>
          <button>JOBS</button>
          <button>APPLIED JOBS</button>
          <button>MESSAGES</button>
        </section>
        <section className="p-6">
          <h2 className="text-lg font-semibold">Drives</h2>
            <ul>
              {jobs.map(job => (
                //<li key={drive.id}>{drive.title}</li>
                <DriveCard job={job} key={job._id}/>
              ))}
            </ul>
        </section>
        <div>Applied jobs map jobCard</div>
    </div>
  )
}

export default Studenthome