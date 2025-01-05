// components/JobDetailsModal.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobDetailsModal = ({ jobId, isOpen, closeModal }) => {
    const [job, setJob] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && jobId) {
            // Fetch the job details when the modal is opened
            const fetchJob = async () => {
                try {
                    const response = await axios.get(`https://placement-managment-system.onrender.com/jobs/${jobId}`);
                    setJob(response.data);
                } catch (err) {
                    setError('Error fetching job details');
                }
            };
            fetchJob();
        }
    }, [isOpen, jobId]);  // Re-run when jobId or modal state changes

    if (!isOpen) return null;  // Don't render if modal is closed

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <p>{error}</p>
                    <button onClick={closeModal} className="mt-4 text-blue-500">Close</button>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-96">
                    <p>Loading...</p>
                    <button onClick={closeModal} className="mt-4 text-blue-500">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-2xl font-semibold">{job.title}</h2>
                <p className="mt-2">{job.description}</p>
                <div className="mt-4">
                    <p><strong>Package:</strong> {job.package}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Company:</strong> {job.companyName}</p>
                    <p><strong>Email:</strong> {job.companyEmail}</p>
                    <p><strong>Job Type:</strong> {job.type}</p>
                    <p><strong>Status:</strong> {job.status}</p>
                    <h3 className="mt-4 font-semibold">Requirements:</h3>
                    <ul className="list-disc ml-6">
                        {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
                <button onClick={closeModal} className="mt-6 text-blue-500">Close</button>
            </div>
        </div>
    );
};

export default JobDetailsModal;
