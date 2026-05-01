// backend/server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // FIX: [Security Headers]
const cookieParser = require('cookie-parser'); // FIX: [Token Storage]
const errorHandler = require('./middleware/error'); // FIX: [Global Error Handler]

// FIX: [Startup Checks] Refuse to start if critical env variables are missing
if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

const app = express();

// Middleware
// FIX: [Security Headers] Add helmet for production security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for demo simplicity with CDNs, but keep other protections
}));

// FIX: [Token Storage] Add cookie parser for reading httpOnly cookies
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true // FIX: [Token Storage] Allow cookies to be sent
}));

app.use(express.json());

// FIX: [Static File Serving] Serve frontend files in production
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // FIX: [MongoDB URI Fallback] Exit on failure
  });

// FIX: [Loading Spinner/Cold Starts] Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// Import Routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const savingsRoutes = require('./routes/savings');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);

// FIX: [Static File Serving] Catch-all route to serve index.html for SPA behavior
app.get('/{*splat}', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// FIX: [Global Error Handler] Register at the end
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
