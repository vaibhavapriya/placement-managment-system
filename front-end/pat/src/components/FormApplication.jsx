import React, { useState } from 'react';
import axios from 'axios';

function FormApplication({ job, closeModal }) {
    
    const [resume, setResume] = useState(null);
    const [candidateNote, setCandidateNote] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    console.log('Job data is missing or invalid:', job);
    const jobId = job._id;

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!resume || !candidateNote.trim()) {
            alert('Please fill in all fields!');
            return;
        }
        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            if (!token) {
                setErrorMessage('You must be logged in to apply for a job.');
                return;
            }

            const requestBody = {
                jobId,
                resume,
                candidateNote,
            };

            const response = await axios.post(`http://localhost:5000/app/${jobId}`, requestBody, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccessMessage('Application submitted successfully!');
            setResume('');
            setCandidateNote('');
        } catch (error) {
            console.error('Error submitting application:', error);
            setErrorMessage(error.response?.data?.error || 'Something went wrong. Please try again later.');
        }

        closeModal();
        alert('Application submitted successfully!');
    };

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Apply for {job.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Resume Upload */}
                    <div>
                        <label className="block font-medium text-gray-700">Upload Resume</label>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
                        />
                    </div>

                    {/* Why Should We Select You */}
                    <div>
                        <label className="block font-medium text-gray-700">Why Should We Select You?</label>
                        <textarea
                             value={candidateNote}
                            onChange={(e) => setCandidateNote(e.target.value)}
                            rows="4"
                            className="mt-1 block w-full border rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormApplication;