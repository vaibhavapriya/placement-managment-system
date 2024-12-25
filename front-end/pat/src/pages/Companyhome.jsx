import React, { useState } from "react";
import axios from "axios";

import Dashboard from '../components/Dashboard'
import AllJobs from '../components/AllJobs'

function Companyhome() {
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/jobs", jobData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for authentication
        },
      });
      setSuccessMessage("Job added successfully!");
      setErrorMessage("");
      setJobData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(
        error.response?.data?.message || "An error occurred while adding the job."
      );
    }
  };

  return (
    <div>
        <Dashboard/>
        <div>
        <div className="add-job-container">
      <h2>Add New Job</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company Name</label>
          <input
            type="text"
            id="company"
            name="company"
            value={jobData.company}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={jobData.salary}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Job
        </button>
      </form>
    </div>
        </div>
        <button>add drive</button>
        <AllJobs/>
    </div>
  )
}

export default Companyhome