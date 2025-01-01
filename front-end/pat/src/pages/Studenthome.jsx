import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DriveCard from '../components/DriveCard';
import AppliedJobs from '../components/Student/AppliedJobs';
import StudentInterviews from '../components/Student/StudentInterviews';

function Studenthome() {
  // State for active section
  const [activeSection, setActiveSection] = useState('jobs'); // Default to 'jobs'
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to view jobs.');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/jobs/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.jobs) {
          setJobs(res.data.jobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'jobs':
        return (
          <section className=" p-1  pt-24">
            <h2 className="text-lg font-semibold p-6 pb-6 ">Jobs</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {jobs.map((job) => (
                <DriveCard job={job} key={job._id}  className="flex justify-center"/>
              ))}
            </ul>
          </section>
        );
      case 'applied':
        return (
          <section className=" p-1 pt-24">
            <h2 className="text-lg font-semibold  pb-6">Applied Jobs</h2>
            <AppliedJobs />
          </section>
        );
      case 'messages':
        return (
          <section className=" p-1 pt-24 ">
            <h2 className="text-lg font-semibold  pb-6">Interviews</h2>
            <StudentInterviews />
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen justify-center w-screen">
      <Header />
      <div className="fixed top-16 left-0 w-screen  p-4 bg-[#F7F4FF] z-0">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveSection('jobs')}
            className={`px-4 py-2 rounded ${
              activeSection === 'jobs' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveSection('applied')}
            className={`px-4 py-2 rounded ${
              activeSection === 'applied'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            Applied Jobs
          </button>
          <button
            onClick={() => setActiveSection('messages')}
            className={`px-4 py-2 rounded ${
              activeSection === 'messages'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            Messages
          </button>
        </div>
      </div>

      <main className="mt-20 p-6 bg-[#F7F4FF] min-h-screen">{renderSection()}</main>
    </div>
  );
}

export default Studenthome;

