import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePatContext } from '../context/PatContext';
import FormDrive from "../components/FormDrive";
import Header from '../components/Header';


function Companyhome() {
  //get company details using id(Context) and store in contest @
  //add jobs @
  //get jobs of the company
  //get applicants
  //edit job details
  //edit application status
  const { state, dispatch } = usePatContext();
  const [loading, setLoading] = useState(true);
  const [jobUpdated, setJobUpdated] = useState(false);
  const [jobs, setJobs] = useState([]);
  const user = state.id;
  
  useEffect(() => {
    const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to post a job.');
            return;
        }
        console.log(state.id + user + `http://localhost:5000/jobs/c/${user}`);

    const fetchJobs = async () => {
      try {
        // Replace this URL with the actual API endpoint
        const response = await axios.get(`http://localhost:5000/jobs/c/${user}`,{
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

    fetchJobs();
  }, [jobUpdated]);

  const [isModalOpen, setIsModalOpen] = useState(false);

    // Open the modal
    const openModal = (job = null) => {
        //setSelectedJob(job);
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

  return (
    <div  className="w-screen min-h-screen">
        <Header/>

        {isModalOpen && <FormDrive closeModal={closeModal} />}

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
                  {/* You can add more details here as needed */}
                  {/* add button to edit <button onClick={() => openModal(job)}>Edit</button> */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No jobs found for your company.</p>
          )}
        </div>
      )}
        </div>
    </div>
  )
}

export default Companyhome