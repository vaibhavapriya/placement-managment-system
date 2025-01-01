import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { usePatContext } from '../context/PatContext';
import FormDrive from "../components/FormDrive";
import Header from '../components/Header';
import JobCard from '../components/JobCard'; 
import Applications from "../components/Company/Applications";
import Interviews from "../components/Company/Interviews";

const Companyhome = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [jobUpdated, setJobUpdated] = useState(false);
  const [error, setError] = useState(null); 

  
  const user = localStorage.getItem('userid');
  const token = localStorage.getItem('token');
  const HeaderMemo = React.memo(Header);

  if (!token) {
    alert('You must be logged in to post a job.');
    return;
  }

  const fetchJobs = useCallback(async () => {
    if (!token) return alert('You must be logged in to post a job.');
    try {
      const response = await axios.get(`http://localhost:5000/jobs/c/${user}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [user, token, isModalOpen]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const openModal = () => {
    setIsModalOpen(true);
    setSelectedJob(null); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null); 
  };

  const openInterviewModal = async (job) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to schedule interviews.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/app/byJob/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShortlistedApplications(response.data.applications.filter(app => app.status === "Shortlisted"));
      setSelectedJob(job);
      setIsInterviewModalOpen(true);
    } catch (error) {
      console.error("Error fetching shortlisted applications:", error);
    }
  };

  const closeInterviewModal = () => {
    setIsInterviewModalOpen(false);
    // setSelectedJob(null);
    // setshortlistedApplications([]); 
  };
  const onViewApplications = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view applications.');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/app/byJob/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.applications && response.data.applications.length > 0) {
        setApplications(response.data.applications);
      } else {
        setApplications([]); // Clear applications if no applications found
        setError(response.message);
        console.log(response.message)
      }
    } catch (error) {
      console.error("Error fetching applications:", error.message);
      setError("Error fetching applications.");
    }
    console.log("Viewing applications for job:", jobId);
  };
  
  
  return (
    <div className="w-screen min-h-screen pt-16 bg-[#F7F9FF] text-[#3D52A0]">
      <HeaderMemo />
      <div className="flex flex-col items-center px-6 pt-10">
        {/* Modals for FormDrive and FormInterview */}
        {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}
        {/* Add Drive Button */}
      <div className="mb-6">
      <button onClick={openModal}
        className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
      >
        + Add Drive
      </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-6 w-screen">
        {/* job secton */}
        <div className="col-span-1 md:max-h-[80vh] md:overflow-y-auto">
            {loading ? <div>Loading jobs...</div> : jobs.length > 0 ? jobs.map(job => (
              <JobCard key={job._id} job={job} applications={applications} setApplications={setApplications}/>
            )):(<p className="text-center text-lg text-[#8697C4]">No jobs found for your company.</p>)}
        </div>
        {/* <div className="col-span-1 md:max-h-[80vh] md:overflow-y-auto">
            {loading ? <div>Loading jobs...</div> : jobs.map(job => (
              <JobCard key={job._id} job={job} openModal={openModal} openInterviewModal={openInterviewModal} onViewApplications={onViewApplications} />
            ))}
        </div> */}
          {/* <div> {jobs.length > 0 ?(<JobCard key={job._id} job={job} openModal={openModal} openInterviewModal={openInterviewModal} />):(<p className="text-center text-lg text-[#8697C4]">No jobs found for your company.</p>)} </div> */}

          {/* Applications Section */}
        <div className="col-span-1 md:col-span-2">
            <Applications applications={applications} />
        </div>
      </section>
        <Interviews />
      </div>
    </div>
  );
};

export default Companyhome;
