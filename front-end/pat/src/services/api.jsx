import axios from 'axios';

const API_URL = 'http://localhost:5000';

const getJobListings = async (token) => {
    const response = await axios.get(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const getApplicantsForJob = async (token, jobId) => {
    const response = await axios.get(`${API_URL}/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export { getJobListings, getApplicantsForJob };
