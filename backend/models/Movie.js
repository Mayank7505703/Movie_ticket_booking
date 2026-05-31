// models/Movie.js - Defines the Movie schema for MongoDB

const mongoose = require('mongoose');

// Each showtime has a time label and available/booked seats
const showtimeSchema = new mongoose.Schema({
  time:          { type: String, required: true },   // e.g., "10:00 AM"
  totalSeats:    { type: Number, default: 50 },
  bookedSeats:   { type: [String], default: [] },    // Array of seat IDs like "A1", "B3"
});

const movieSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    genre:       { type: String, required: true },   // e.g., "Action", "Comedy"
    duration:    { type: String, required: true },   // e.g., "2h 15m"
    language:    { type: String, default: 'English' },
    rating:      { type: Number, min: 0, max: 10, default: 0 },
    posterUrl:   { type: String, default: '' },      // Link to movie poster image
    releaseDate: { type: Date },
    showtimes:   [showtimeSchema],                   // Array of available show timings
    isActive:    { type: Boolean, default: true },   // Hide/show from listings
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
