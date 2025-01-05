import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormDrive({ closeModal, job }) {
    const [jobDetails, setJobDetails] = useState({
        title: '',
        description: '',
        package: 0,
        location: '',
        requirements: '', // Can be a comma-separated string or array
        Jtype: 'Fulltime' // Keep Jtype for frontend
    });

    useEffect(() => {
        if (job) {
            setJobDetails({
                title: job.title || '',
                description: job.description || '',
                location: job.location || '',
                status: job.status || '',
                package: job.package || '',
                requirements: job.requirements ? job.requirements.join(', ') : '', // Ensure it's a comma-separated string if it's an array
                Jtype: job.type || 'Fulltime', // Default to Fulltime if not provided
            });
        }
    }, [job]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to post a job.');
            return;
        }

        const updatedJob = {
            title: jobDetails.title,
            description: jobDetails.description,
            package: jobDetails.package,
            location: jobDetails.location,
            requirements: jobDetails.requirements.split(',').map((req) => req.trim()), // Convert comma-separated string to array
            status: jobDetails.status,
            type: jobDetails.Jtype, // Map Jtype to type here
        };

        try {
            let response;

            // If editing an existing job, use PUT. If creating a new job, use POST.
            if (job && job._id) {
                response = await axios.put(`https://placement-managment-system.onrender.com/jobs/edit/${job._id}`, updatedJob, {
                    headers: { Authorization: `Bearer ${token}` },
                }); // Update existing job
            } else {
                response = await axios.post('https://placement-managment-system.onrender.com/jobs/newjob', updatedJob, {
                    headers: { Authorization: `Bearer ${token}` },
                }); // Create new job
            }

            console.log('Job created/updated successfully:', response.data);
            alert('Job posted/updated successfully!');
            closeModal();
        } catch (error) {
            console.error('Error posting/updating job:', error.response?.data || error.message);
            alert('Failed to post/update the job. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">{job ? 'Edit Job' : 'Create New Drive'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="font-semibold text-lg">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={jobDetails.title}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="description" className="font-semibold text-lg">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={jobDetails.description}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="package" className="font-semibold text-lg">Package</label>
                        <input
                            type="number"
                            id="package"
                            name="package"
                            value={jobDetails.package}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="location" className="font-semibold text-lg">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={jobDetails.location}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="requirements" className="font-semibold text-lg">Requirements (comma separated)</label>
                        <input
                            type="text"
                            id="requirements"
                            name="requirements"
                            value={jobDetails.requirements}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="Jtype" className="font-semibold text-lg">Type</label>
                        <select
                            id="Jtype"
                            name="Jtype"
                            value={jobDetails.Jtype}
                            onChange={handleChange}
                            required
                            className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Fulltime">Fulltime</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        {/* Conditionally render the "Status" field if the job exists */}
                        {job && job._id && (
                            <>
                                <label htmlFor="status" className="font-semibold text-lg">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={jobDetails.status}
                                    onChange={handleChange}
                                    required
                                    className="p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Open">Open</option>
                                    <option value="Close">Close</option>
                                </select>
                            </>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            {job._id ? 'Update Job' : 'Add Job'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormDrive;

