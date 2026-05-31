// models/Booking.js - Stores every ticket booking made by users

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // Links to User model
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',          // Links to Movie model
      required: true,
    },
    showtime:    { type: String, required: true },   // e.g., "7:00 PM"
    seats:       { type: [String], required: true }, // e.g., ["A1", "A2"]
    totalAmount: { type: Number, required: true },   // Total price paid
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
