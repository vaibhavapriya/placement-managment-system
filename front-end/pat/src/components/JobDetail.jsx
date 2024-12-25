import React, { useEffect, useState } from 'react';
import { getApplicantsForJob } from '../services/api';
import { useParams } from 'react-router-dom';

const JobDetail = ({ token }) => {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [job, setJob] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            const jobResponse = await axios.get(`http://localhost:5000/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setJob(jobResponse.data);

            const applicantsResponse = await getApplicantsForJob(token, jobId);
            setApplicants(applicantsResponse);
        };
        fetchJobDetails();
    }, [jobId, token]);

    if (!job) return <div>Loading job details...</div>;

    return (
        <div>
            <h2>{job.title}</h2>
            <p>{job.description}</p>
            <p>Status: {job.status}</p>
            <h3>Applicants:</h3>
            {applicants.length === 0 ? (
                <p>No applicants for this job yet.</p>
            ) : (
                <ul>
                    {applicants.map((applicant) => (
                        <li key={applicant._id}>
                            <p>Name: {applicant.name}</p>
                            <p>Email: {applicant.email}</p>
                            <p>Resume: <a href={applicant.resumeUrl}>Download</a></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobDetail;
