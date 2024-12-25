import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobList = ({ token }) => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/jobs', {
                    headers: { Authorization: `Bearer ${token}` }, // Pass the token for authentication
                });
                setJobs(response.data.jobs);
            } catch (error) {
                console.error("Error fetching job listings:", error);
            }
        };

        fetchJobs();
    }, [token]);

    return (
        <div>
            <h2>Job Listings</h2>
            {jobs.length === 0 ? (
                <p>No job listings found.</p>
            ) : (
                <ul>
                    {jobs.map((job) => (
                        <li key={job._id}>
                            <h3>{job.title}</h3>
                            <p>{job.description}</p>
                            <p>Status: {job.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobList;
