import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { usePatContext } from '../context/PatContext';
import FormDrive from "../components/FormDrive";
import Header from '../components/Header';
import JobCard from '../components/JobCard'; 
import Applications from "../components/Company/Applications";
import FormInterview from "../components/FormInterview";
import Interviews from "../components/Company/Interviews";

const Companyhome = () => {
  const { state, dispatch } = usePatContext();
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobUpdated, setJobUpdated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  
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
  }, [user, token, jobUpdated]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const openModal = useCallback((job = null) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

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

  const closeModal = () => {
    setIsModalOpen(false);
    //setSelectedJob(null);
  };

  const closeInterviewModal = () => {
    setIsInterviewModalOpen(false);
    // setSelectedJob(null);
    // setshortlistedApplications([]); 
  };

  const onViewApplications = async(jobId) => {
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

      if (response.data.applications) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
    console.log("Viewing applications for job:", jobId);
    // You can add more logic here (e.g., navigate to a different page or show a modal with the applications)
  };
  
  return (
    <div className="w-screen min-h-screen pt-16 bg-[#F7F9FF] text-[#3D52A0]">
      <HeaderMemo />
      <div className="flex flex-col items-center px-6 pt-10">
        {/* Modals for FormDrive and FormInterview */}
        {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}
        {isInterviewModalOpen && <FormInterview closeModal={closeInterviewModal} jobId={selectedJob._id} students={shortlistedApplications} />}
        
        {/* Jobs Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-6 w-screen">
          <div className="col-span-1 md:max-h-[80vh] md:overflow-y-auto">
            {loading ? <div>Loading jobs...</div> : jobs.map(job => (
              <JobCard key={job._id} job={job} openModal={openModal} openInterviewModal={openInterviewModal} />
            ))}
          </div>
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
