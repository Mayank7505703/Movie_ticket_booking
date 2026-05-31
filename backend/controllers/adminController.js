// controllers/adminController.js
// Only accessible by admin users — shows all bookings across all users

const Booking = require('../models/Booking');
const User    = require('../models/User');
const Movie   = require('../models/Movie');

// ─── GET dashboard stats ──────────────────────────────────────────────────────
// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalBookings  = await Booking.countDocuments();
    const totalUsers     = await User.countDocuments({ role: 'user' });
    const totalMovies    = await Movie.countDocuments({ isActive: true });

    // Sum up all revenue from confirmed bookings
    const revenueResult  = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Count confirmed vs cancelled
    const confirmed  = await Booking.countDocuments({ status: 'confirmed' });
    const cancelled  = await Booking.countDocuments({ status: 'cancelled' });

    res.json({ totalBookings, totalUsers, totalMovies, totalRevenue, confirmed, cancelled });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// ─── GET all bookings (with user + movie info) ────────────────────────────────
// GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user',  'name email')          // Show who booked
      .populate('movie', 'title genre posterUrl') // Show which movie
      .sort({ createdAt: -1 });                 // Latest first

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error: error.message });
  }
};

// ─── Make a user admin (by email) ────────────────────────────────────────────
// PUT /api/admin/make-admin
const makeAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `✅ ${user.name} is now an admin!`, user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

module.exports = { getDashboardStats, getAllBookings, makeAdmin };
