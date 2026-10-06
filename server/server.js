import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Config & Database
import { connectDB, getDBStatus } from './config/db.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Resolve directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Establish MongoDB Connection
connectDB();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode for local network testing
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging in Development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ==========================================
// Health & Diagnostic Endpoint
// ==========================================
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  return res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'EventHub Smart Event Management API is operating normally',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      connected: dbStatus.isConnected,
      status: dbStatus.readyState === 1 ? 'Connected' : 'Disconnected',
      host: dbStatus.host,
      name: dbStatus.name,
    },
    apiBase: 'http://localhost:5000/api',
    endpoints: [
      '/api/health',
      '/api/auth',
      '/api/events',
      '/api/registrations',
      '/api/volunteers',
      '/api/tasks',
      '/api/schedules',
      '/api/announcements',
      '/api/users',
      '/api/dashboard',
    ],
  });
});

// Root API Greeting
app.get('/api', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to EventHub Smart Event Management & Volunteer Coordination API v1.0',
    documentation: '/api/health',
  });
});

// ==========================================
// Primary API Route Mounting
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ==========================================
// Static Assets & SPA Routing Fallback
// ==========================================
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ==========================================
// Centralized Error Handling
// ==========================================
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
let server = null;

if (process.env.NODE_ENV !== 'test_runner') {
  server = app.listen(PORT, () => {
    console.log(`\n🚀 EventHub Backend Server is running on port ${PORT}`);
    console.log(`🌐 Base API URL:   http://localhost:${PORT}/api`);
    console.log(`🩺 Health check:   http://localhost:${PORT}/api/health`);
    console.log(`🔒 CORS Origin:    http://localhost:5173\n`);
  });
}

export { app, server };
export default app;
