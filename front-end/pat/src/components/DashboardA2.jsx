import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie,  Doughnut } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardA2 = () => {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/dashboard/dashboard-metrics');
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) return <div>Loading...</div>;

  const lineData = {
    labels: metrics?.trendOverTime?.map((item) => item.date) || [],
    datasets: [
      {
        label: 'Placements Over Time',
        data: metrics?.trendOverTime?.map((item) => item.placements) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const pieData = {
    labels: metrics?.jobStats?.map((job) => job.title) || [],
    datasets: [
      {
        label: 'Applications',
        data: metrics?.jobStats?.map((job) => job.totalApplications) || [],
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#E91E63', '#9C27B0'],
      },
    ],
  };

  // Handle Pie chart click event
  const handlePieClick = (event, chartElement) => {
    if (chartElement.length > 0) {
      const jobIndex = chartElement[0].index; // Get the index of the clicked segment
      const jobId = metrics?.jobStats[jobIndex]._id; // Get the corresponding jobId
      navigate(`/job/${jobId}`); // Redirect to job details page
    }
  };

  const doughnutData = {
    labels: ['Applied', 'Hired', 'Rejected'],
    datasets: [
      {
        label: 'Job Status',
        data: [metrics.appliedCount, metrics.hiredCount, metrics.rejectedCount],
        backgroundColor: ['#FF9800', '#4CAF50', '#E91E63'],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Recruitment Dashboard</h1>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Students Card */}
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Total Students</h3>
          <p className="text-2xl">{metrics.totalStudents}</p>
        </div>

        {/* Total Jobs Card */}
        <div className="bg-teal-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Total Jobs</h3>
          <p className="text-2xl">{metrics.totalJobs}</p>
        </div>

        {/* Total Companies Card */}
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Total Companies</h3>
          <p className="text-2xl">{metrics.totalCompanies}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Students Placed</h3>
          <p className="text-2xl">{metrics.hiredCount}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Offers Accepted</h3>
          <p className="text-2xl">{metrics.hiredCount}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold">Success Rate</h3>
          <p className="text-2xl">{metrics.successRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Charts in a responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Line Chart: Placements Over Time */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Placements Over Time</h2>
          <Line data={lineData} />
        </div>

        {/* Pie Chart: Applications per Job */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Applications per Job</h2>
          <Pie
            data={pieData}
            options={{
              onClick: handlePieClick, // Attach the click handler
            }}
          />
        </div>
      </div>
      {/* Doughnut Chart: Job Status Breakdown */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Job Status Breakdown</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default DashboardA2;

