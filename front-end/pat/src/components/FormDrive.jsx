import React, { useState, useEffect } from 'react'
import axios from 'axios';

function FormDrive({ closeModal }) {

    const [jobDetails, setJobDetails] = useState({
        title: '',
        description: '',
        package: 0,
        location: '',
        requirements: '',
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJobDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit =  async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to post a job.');
            return;
        }

        try {
            const newJob = {
                title: jobDetails.title,
                description: jobDetails.description,
                package: jobDetails.package,
                location: jobDetails.location,
                requirements: jobDetails.requirements.split(','), // Convert comma-separated string to array
            };
            let res;
            res = await axios.post('http://localhost:5000/jobs/newjob', newJob,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Job created successfully:', res.data);
            alert('Job posted successfully!');
            closeModal();
        } catch (error) {
            console.error('Error posting job:', error.response?.data || error.message);
            alert('Failed to post the job. Please try again.');
        }
        // Close the modal after submitting the form
        closeModal();
    };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">{'Create New Drive'}</h2>
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

            <div className="flex justify-between items-center mt-6">
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Submit
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
  )
}

export default FormDrive