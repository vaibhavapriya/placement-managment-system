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
<div className="w-screen min-h-screen pt-16 bg-[#F7F9FF] text-[#3D52A0]">
  <Header />
  <div className="flex flex-col items-center px-6">
    {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}
    
    {/* Add Drive Button */}
    <div className="mb-6">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
      >
        + Add Drive
      </button>
    </div>
    
    {/* Job List Section */}
    <div className="w-full max-w-4xl">
      {loading ? (
        <div className="text-center text-lg">Loading jobs...</div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Jobs posted by your company:</h2>
          {jobs.length > 0 ? (
            <ul className="space-y-4">
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className="border rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-[#3D52A0]">{job.title}</h3>
                  <p className="text-sm text-[#6B6A85]">{job.description}</p>
                  <p className="text-sm font-medium text-[#8697C4]">Status: {job.status}</p>
                  <div className="mt-4 flex space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => openModal(job)}
                      className="px-4 py-2 bg-[#7091E6] text-white rounded hover:bg-[#5C81D4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
                    >
                      Edit
                    </button>
                    {/* View Applications Button */}
                    <button
                      onClick={() => fetchApplications(job._id)}
                      className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
                    >
                      View Applications
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-lg text-[#8697C4]">No jobs found for your company.</p>
          )}
        </div>
      )}
    </div>

    {/* Applications Section */}
    <div className="w-full max-w-4xl mt-8">
      <Applications applications={applications} />
    </div>
  </div>
</div>

  );
}

export default Companyhome;
