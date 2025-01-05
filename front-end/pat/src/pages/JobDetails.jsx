import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams  } from 'react-router-dom';
import FormApplication from '../components/FormApplication';

const JobDetails = () => {
    const navigate = useNavigate();
    const { jobId } = useParams(); // Get the jobId from the URL
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleApply = () => {
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://placement-managment-system.onrender.com/jobs/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setJob(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="min-h-screen w-screen flex justify-center items-center bg-[#F7F9FF]">
        <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-3xl">
          <div className=" w-full flex justify-start mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-[#7091E6] hover:underline focus:outline-none mb-4 justify-start"
          >
            Go Back
          </button>
          </div>
          {isModalOpen && <FormApplication job={job} closeModal={closeModal} />}
          <h1 className="text-3xl font-bold text-[#3D52A0] mb-6 border-b-2 border-[#7091E6] pb-2">
            {job.title}
          </h1>
          <div className="space-y-4">
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Company:</strong> {job.companyName}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Company Email:</strong> {job.companyEmail}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Description:</strong> {job.description}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Package:</strong> ${job.package}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Location:</strong> {job.location}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Type:</strong> {job.type}
            </p>
            <p className="text-[#4A4A6A]">
              <strong className="text-[#3D52A0]">Status:</strong> {job.status}
            </p>
            <div>
              <p className="text-[#4A4A6A]">
                <strong className="text-[#3D52A0]">Requirements:</strong>
              </p>
              <ul className="list-disc list-inside text-[#4A4A6A] pl-4">
                {job.requirements.map((req, index) => (
                  <li key={index} className="mt-1">
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            {/* <button
              onClick={handleApply}
              className="mt-4 py-2 px-6 w-full text-white bg-[#3D52A0] hover:bg-[#2E4292] rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7091E6] focus:ring-offset-2"
            >
              Apply
            </button> */}
          </div>
        </div>
      </div>
      

    );
};

export default JobDetails;
