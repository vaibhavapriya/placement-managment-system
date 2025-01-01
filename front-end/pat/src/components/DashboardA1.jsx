import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
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
  BarElement,
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
  ArcElement,
  BarElement
);

const DashboardA1 = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/dashboard/dashboard-metrics'); // Replace with your API endpoint
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) return <div>Loading...</div>;

  // Prepare data for Interview Outcomes Chart
  const interviewOutcomesData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Interview Outcomes',
        data: [
          metrics.interviewOutcomes.scheduledCount,
          metrics.interviewOutcomes.completedCount,
          metrics.interviewOutcomes.cancelledCount,
        ],
        backgroundColor: ['#FF9800', '#4CAF50', '#E91E63'],
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Recruitment Dashboard</h1>

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Placements Over Time</h2>
        <Line data={lineData} />
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Applications per Job</h2>
        <Pie data={pieData} />
      </div>

      {/* Interview Outcomes Bar Chart */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Interview Outcomes</h2>
        <Bar data={interviewOutcomesData} />
      </div>

      {/* Cards for Summary Metrics */}
      <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
};

export default DashboardA1;
