import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePatContext } from '../context/PatContext' ;
import FormDrive from "../components/FormDrive";
import Header from '../components/Header';
import Applications from "../components/Applications";

function Companyhome() {
  const { state, dispatch } = usePatContext();
  const [selectedJob, setSelectedJob] = useState(null);  // Store selected job for editing
  const [loading, setLoading] = useState(true);
  const [jobUpdated, setJobUpdated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const user = state.id;

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to post a job.');
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/jobs/c/${user}`, {
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
        setLoading(false);
      }
    };

    fetchJobs();
  }, [jobUpdated]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (job = null) => {
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
  };

  return (
    <div className="w-screen min-h-screen">
      <Header />
      <div>space</div>
      <div>space</div>
      <div>space</div>
      <div>space</div>
      <div className="justify-center items-center">
        {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}  {/* Pass selectedJob to FormDrive */}
        <div>
          <button onClick={openModal}>+ Add drive</button>
        </div>
        <div>
          {loading ? (
            <div>Loading jobs...</div>
          ) : (
            <div>
              <h2>Jobs posted by your company:</h2>
              {jobs.length > 0 ? (
                <ul>
                  {jobs.map((job) => (
                    <li key={job._id}>
                      <h3>{job.title}</h3>
                      <p>{job.description}</p>
                      <p>Status: {job.status}</p>
                      <button onClick={() => openModal(job)}>Edit</button>
                      <button onClick={() => fetchApplications(job._id)}>
                        View Applications
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No jobs found for your company.</p>
              )}
            </div>
          )}
        </div>
        <div>
          <Applications applications={applications} />
        </div>
      </div>
    </div>
  );
}

export default Companyhome;
