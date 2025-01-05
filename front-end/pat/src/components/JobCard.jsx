import React,  { useEffect, useState }  from 'react';
import axios from "axios";
import FormDrive from "../components/FormDrive";
import FormInterview from "../components/FormInterview";
import { Link } from 'react-router-dom';

function JobCard({ job , applications , setApplications}) {

    const jobId=job._id;
    const token = localStorage.getItem('token');
    //const user = localStorage.getItem('userid');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //const [applications, setApplications] = useState([]);
    const [shortlistedApplications, setshortlistedApplications] = useState([]);
    const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

    const openModal = (job) => {
      setSelectedJob(job);  // Set the job to be edited
      setIsModalOpen(true);
    };
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedJob(null);  // Clear the selected job when closing modal
    };


    const fetchApplications = async (jobId) => {
      
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view applications.');
        return;
      }
  
      try {
        const response = await axios.get(`https://placement-managment-system.onrender.com/app/byJob/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.applications) {
          setApplications(response.data.applications);
        }
      }catch (err) {
        const errorMessage = err.response?.data?.error || "Something went wrong";
        alert(errorMessage ); // Set the error to state
      }
    };
    const openInterviewModal = async (job) => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        alert("You must be logged in to schedule interviews.");
        return;
      }
    
      try {
        const response = await axios.get(`https://placement-managment-system.onrender.com/app/byJob/${job._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.data.applications) {
          const shortlistedStudents = response.data.applications
            .filter((app) => app.status === "Shortlisted");
            //.map((app) => app.student); // Array of shortlisted student IDs
          setshortlistedApplications(shortlistedStudents);
          console.log(response.data.applications);
          setSelectedJob(job);
          setIsInterviewModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    
  
    const closeInterviewModal = () => {
      setIsInterviewModalOpen(false);
      setSelectedJob(null);
      setshortlistedApplications([]); // Clear the list of shortlisted students
    };

  return (
    <div className="border border-[#E0E7FF] rounded-lg bg-white shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">

      {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}
      {isInterviewModalOpen && <FormInterview closeModal={closeInterviewModal} jobId={selectedJob._id} students={shortlistedApplications} />}
      <Link to={`/job/${job._id}`}><h3 className="text-2xl font-semibold text-[#3D52A0]">{job.title}</h3></Link>
      <p className="text-md text-[#6B6A85] mb-2">{job.description}</p>
      <p className="text-sm font-medium text-[#8697C4] mb-4">Status: {job.status}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        {/* Edit Button */}
        <button
          onClick={() => openModal(job)}
          className="px-5 py-2 bg-[#7091E6] text-white rounded-lg hover:bg-[#5C81D4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          Edit
        </button>
        {/* View Applications Button */}
        <button
          onClick={() => fetchApplications(job._id)}
          className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          View Applications
        </button>
        {/* Schedule Interview Button */}
        <button
          onClick={() => openInterviewModal(job)}
          className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
        >
          Schedule Interview
        </button>
      </div>
    </div>
  );
}

export default JobCard;
