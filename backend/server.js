require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const mongoose = require('mongoose');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [
  'https://prince-princes-projects-508ddebb.vercel.app',
  'https://prince-beta-one.vercel.app',
  'https://prince-git-main-princes-projects-508ddebb.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined/null values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Set up Socket.IO
const io = new Server(server, {
  cors: corsOptions
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export io to be used in routes
app.set('io', io);

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route - doesn't require database connection
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Database connection status route
app.get('/api/status', async (req, res) => {
  try {
    const { connection } = require('mongoose');
    const status = {
      connected: connection.readyState === 1,
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][connection.readyState],
      host: connection.host,
      database: connection.db?.databaseName,
      port: process.env.PORT,
      environment: process.env.NODE_ENV
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import routes
const messageRoutes = require('./routes/messages');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');
const aboutRoutes = require('./routes/about');

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api', adminRoutes);
app.use('/api/about', aboutRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Start server and connect to database
const startServer = async () => {
  const PORT = process.env.PORT || 10000;
  const BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://portfolio-backend-aa7l.onrender.com'
    : `http://localhost:${PORT}`;
  
  try {
    // Start server first
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Health check: ${BASE_URL}/health`);
      console.log(`API Status: ${BASE_URL}/api/status`);
      console.log('CORS enabled for origins:', allowedOrigins);
      console.log('WebSocket server is running');
    });

    // Then try to connect to database
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Failed to start server or connect to database:', error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:');
  console.error('Reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:');
  console.error(error);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));