import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams(); // Get the jobId from the URL
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/jobs/${jobId}`, {
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
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg mt-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4"><Link to={`/job/${job._id}`}>{job.title}</Link></h1>
            <p className="text-gray-700 mb-4">
                <strong>Company:</strong> {job.companyName}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Company Email:</strong> {job.companyEmail}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Description:</strong> {job.description}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Package:</strong> ${job.package}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Location:</strong> {job.location}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Type:</strong> {job.type}
            </p>
            <p className="text-gray-700 mb-4">
                <strong>Status:</strong> {job.status}
            </p>
            <p className="text-gray-700">
                <strong>Requirements:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700">
                {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
            </ul>
        </div>
    );
};

export default JobDetails;
