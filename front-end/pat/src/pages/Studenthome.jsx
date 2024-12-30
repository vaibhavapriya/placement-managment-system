import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import DriveCard from '../components/DriveCard';
import AppliedJobs from '../components/AppliedJobs';

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
          <section className="p-6  pt-24">
            <h2 className="text-lg font-semibold">Available Jobs</h2>
            <ul>
              {jobs.map((job) => (
                <DriveCard job={job} key={job._id} />
              ))}
            </ul>
          </section>
        );
      case 'applied':
        return (
          <section className="p-6 pt-24">
            <h2 className="text-lg font-semibold">Applied Jobs</h2>
            <AppliedJobs />
          </section>
        );
      case 'messages':
        return (
          <section className="p-6 pt-24">
            <h2 className="text-lg font-semibold">Messages</h2>
            <p>No messages available.</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="fixed top-16 left-0 w-full bg-white shadow-md p-4 z-10">
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

      <main className="mt-20 p-6">{renderSection()}</main>
    </div>
  );
}

export default Studenthome;

