// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { usePatContext } from '../context/PatContext' ;
// import FormDrive from "../components/FormDrive";
// import Header from '../components/Header';
// import Applications from "../components/Company/Applications";
// import FormInterview from "../components/FormInterview";
// import Interviews from "../components/Company/Interviews";

// function Companyhome() {
//   const { state, dispatch } = usePatContext();
//   const [selectedJob, setSelectedJob] = useState(null);  // Store selected job for editing
//   const [loading, setLoading] = useState(true);
//   const [jobUpdated, setJobUpdated] = useState(false);
//   const [jobs, setJobs] = useState([]);
//   const [applications, setApplications] = useState([]);
//   const [shortlistedApplications, setshortlistedApplications] = useState([]);
//   const user = localStorage.getItem('userid');

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       alert('You must be logged in to post a job.');
//       return;
//     }

//     const fetchJobs = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/jobs/c/${user}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data.jobs) {
//           setJobs(response.data.jobs);
//         }
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [jobUpdated]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

//   const openModal = (job = null) => {
//     setSelectedJob(job);  // Set the job to be edited
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedJob(null);  // Clear the selected job when closing modal
//   };

//   const openInterviewModal = async (job) => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       alert("You must be logged in to schedule interviews.");
//       return;
//     }
  
//     try {
//       const response = await axios.get(`http://localhost:5000/app/byJob/${job._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       if (response.data.applications) {
//         const shortlistedStudents = response.data.applications
//           .filter((app) => app.status === "Shortlisted");
//           //.map((app) => app.student); // Array of shortlisted student IDs
//         setshortlistedApplications(shortlistedStudents);
//         console.log(response.data.applications);
//         setSelectedJob(job);
//         setIsInterviewModalOpen(true);
//       }
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//     }
//   };
  

//   const closeInterviewModal = () => {
//     setIsInterviewModalOpen(false);
//     setSelectedJob(null);
//     setshortlistedApplications([]); // Clear the list of shortlisted students
//   };

//   const fetchApplications = async (jobId) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('You must be logged in to view applications.');
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:5000/app/byJob/${jobId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.applications) {
//         setApplications(response.data.applications);
//       }
//     } catch (error) {
//       console.error("Error fetching applications:", error);
//     }
//   };

//   return (
// <div className="w-screen min-h-screen pt-16 bg-[#F7F9FF] text-[#3D52A0]">
//   <Header />
//   <div className="flex flex-col items-center px-6 pt-10">
//     {isModalOpen && <FormDrive closeModal={closeModal} job={selectedJob} />}
//     {isInterviewModalOpen && <FormInterview closeModal={closeInterviewModal} jobId={selectedJob._id} students={shortlistedApplications}/>}
//     {/* Add Drive Button */}
//     <div className="mb-6">
//       <button
//         onClick={openModal}
//         className="px-4 py-2 bg-[#3D52A0] text-white rounded hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
//       >
//         + Add Drive
//       </button>
//     </div>
//     <section className="grid grid-cols-1 md:grid-cols-3  gap-8 py-8 px-6 w-screen">
//   {/* Column 1: Job Listings */}
//   <div className="col-span-1 md:max-h-[80vh] md:overflow-y-auto">
//     {loading ? (
//       <div className="text-center text-lg text-[#3D52A0]">Loading jobs...</div>
//     ) : (
//       <div className="p-6 ">
//         <h2 className="text-3xl font-semibold text-[#3D52A0] mb-6"></h2>
//         {jobs.length > 0 ? (
//           <ul className="space-y-6">
//             {jobs.map((job) => (
//               <li
//                 key={job._id}
//                 className="border border-[#E0E7FF] rounded-lg bg-white shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
//               >
//                 <h3 className="text-2xl font-semibold text-[#3D52A0]">{job.title}</h3>
//                 <p className="text-md text-[#6B6A85] mb-2">{job.description}</p>
//                 <p className="text-sm font-medium text-[#8697C4] mb-4">Status: {job.status}</p>
//                 <div className="mt-4 flex flex-wrap gap-4">
//                   {/* Edit Button */}
//                   <button
//                     onClick={() => openModal(job)}
//                     className="px-5 py-2 bg-[#7091E6] text-white rounded-lg hover:bg-[#5C81D4] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
//                   >
//                     Edit
//                   </button>
//                   {/* View Applications Button */}
//                   <button
//                     onClick={() => fetchApplications(job._id)}
//                     className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
//                   >
//                     View Applications
//                   </button>
//                   {/* Schedule Interview Button */}
//                   <button
//                     onClick={() => openInterviewModal(job)}
//                     className="px-5 py-2 bg-[#3D52A0] text-white rounded-lg hover:bg-[#2E4292] focus:outline-none focus:ring-2 focus:ring-[#7091E6] transition duration-300"
//                   >
//                     Schedule Interview
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-center text-lg text-[#8697C4]">No jobs found for your company.</p>
//         )}
//       </div>
//     )}
//   </div>

//   {/* Column 2: Applications Section (twice the width of the first column) */}
//   <div className="col-span-1 md:col-span-2">
//     <Applications applications={applications} />
//   </div>
//     </section>
//     <div>
//       <Interviews/>
//     </div>
  


//   </div>
// </div>

//   );
// }

// export default Companyhome;

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
              <JobCard key={job._id} job={job} openModal={openModal} openInterviewModal={openInterviewModal} onViewApplications={onViewApplications} />
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
