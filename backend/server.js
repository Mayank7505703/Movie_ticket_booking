// server.js - Main entry point for the backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());                        // Allow requests from React frontend
app.use(express.json());               // Parse incoming JSON requests

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/movies',  require('./routes/movieRoutes'));
app.use('/api/bookings',require('./routes/bookingRoutes'));
app.use('/api/admin',   require('./routes/adminRoutes'));   // Admin dashboard routes

// ─── Root Route ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('🎬 Movie Ticket Booking API is running!');
});

// ─── Connect to MongoDB & Start Server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
