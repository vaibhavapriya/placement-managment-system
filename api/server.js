const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/loginRoutes');
const jobRoutes = require('./routes/joblistingRoutes');
const appRoutes = require('./routes/applicationRoutes');
const stuRoutes = require('./routes/studentRoutes');
const intRoutes = require('./routes/interviewRoutes');
const dashRoutes = require('./routes/dashboardRoutes');
// const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

app.options('*', cors());
// Middleware
app.use(cors()); // Use CORS middleware
app.use(cors({
  origin: 'https://cosmic-capybara-45892a.netlify.app', // Allow your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/app', appRoutes);
app.use('/jobs', jobRoutes);
app.use('/auth', authRoutes);
app.use('/student', stuRoutes);
app.use('/interviews', intRoutes);
app.use('/dashboard', dashRoutes);

// Error Handling Middleware
// app.use(errorHandler);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up the HTTP server and Socket.io
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server);

// WebSocket connection setup
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle sending and receiving messages
  socket.on('send_message', (messageData) => {
    console.log('Received message:', messageData);
    io.emit('receive_message', messageData); // Broadcast message to all connected clients
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
