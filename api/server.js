const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
//const driveRoutes = require('./routes/joblistingRoutes');
const authRoutes = require('./routes/loginRoutes')
//const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Initialize the app
const app = express();
app.use(bodyParser.json());


// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Use CORS middleware
 app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
 }));

app.use(express.json());

// Routes
//app.use('/jobs', driveRoutes);
app.use('/auth', authRoutes);

// Error Handling Middleware
//app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));