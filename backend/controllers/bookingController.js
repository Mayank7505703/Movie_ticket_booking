// controllers/bookingController.js
// Handles ticket booking, cancellation, and fetching bookings

const Booking = require('../models/Booking');
const Movie   = require('../models/Movie');

const PRICE_PER_SEAT = 250; // ₹250 per seat

// ─── Book tickets ─────────────────────────────────────────────────────────────
// POST /api/bookings
const createBooking = async (req, res) => {
  const { movieId, showtimeId, seats } = req.body;
  // seats = array of seat labels like ["A1", "A2"]
  // showtimeId = the _id of the showtime subdocument

  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Find the selected showtime inside the movie document
    const showtime = movie.showtimes.id(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Check if any of the requested seats are already booked
    const alreadyBooked = seats.filter((seat) => showtime.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        message: `Seats already booked: ${alreadyBooked.join(', ')}`,
      });
    }

    // Mark seats as booked in the movie document
    showtime.bookedSeats.push(...seats);
    await movie.save();

    // Create the booking record
    const booking = await Booking.create({
      user:        req.user._id,
      movie:       movieId,
      showtime:    showtime.time,
      seats,
      totalAmount: seats.length * PRICE_PER_SEAT,
    });

    // Populate movie details before sending response
    await booking.populate('movie', 'title posterUrl');

    res.status(201).json({ message: '🎟️ Booking confirmed!', booking });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
};

// ─── Get all bookings for the logged-in user ──────────────────────────────────
// GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl genre duration')
      .sort({ createdAt: -1 }); // Latest first

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// ─── Cancel a booking ─────────────────────────────────────────────────────────
// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the user who made the booking can cancel it
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Free up the seats in the movie document
    const movie = await Movie.findById(booking.movie);
    if (movie) {
      for (const showtime of movie.showtimes) {
        if (showtime.time === booking.showtime) {
          showtime.bookedSeats = showtime.bookedSeats.filter(
            (seat) => !booking.seats.includes(seat)
          );
        }
      }
      await movie.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };
