// pages/MovieDetailPage.js
// Shows full movie info + showtime selector + seat picker + booking summary

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import SeatPicker from '../components/SeatPicker';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './MovieDetailPage.css';

const PRICE_PER_SEAT = 250;

const MovieDetailPage = () => {
  const { id } = useParams();          // Movie ID from URL
  const navigate  = useNavigate();
  const { isLoggedIn } = useAuth();

  const [movie,         setMovie]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [selectedShow,  setSelectedShow]  = useState(null);   // Which showtime selected
  const [selectedSeats, setSelectedSeats] = useState([]);     // Which seats clicked
  const [booking,       setBooking]       = useState(false);  // Booking in progress

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { data } = await api.get(`/movies/${id}`);
        setMovie(data);
        // Auto-select first showtime
        if (data.showtimes.length > 0) setSelectedShow(data.showtimes[0]);
      } catch {
        toast.error('Movie not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Toggle seat selection
  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)   // Deselect
        : [...prev, seat]                  // Select
    );
  };

  // When showtime changes, clear selected seats
  const handleShowtimeChange = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  // Submit booking
  const handleBooking = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to book tickets');
      return navigate('/login');
    }
    if (selectedSeats.length === 0) return toast.error('Select at least one seat');

    try {
      setBooking(true);
      await api.post('/bookings', {
        movieId:    movie._id,
        showtimeId: selectedShow._id,
        seats:      selectedSeats,
      });
      toast.success(`🎉 Booking confirmed! ${selectedSeats.length} seat(s) booked.`);
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="spinner"></div>;
  if (!movie)  return null;

  return (
    <div className="detail-page fade-in">
      {/* ── Movie Header ── */}
      <div className="detail-hero">
        <div
          className="detail-hero-bg"
          style={{ backgroundImage: `url(${movie.posterUrl})` }}
        ></div>
        <div className="container detail-hero-content">
          <img
            className="detail-poster"
            src={movie.posterUrl || 'https://via.placeholder.com/300x450'}
            alt={movie.title}
          />
          <div className="detail-info">
            <span className="badge">{movie.genre}</span>
            <h1 className="detail-title">{movie.title}</h1>
            <div className="detail-meta">
              <span>⭐ {movie.rating.toFixed(1)}</span>
              <span>🕐 {movie.duration}</span>
              <span>🌐 {movie.language}</span>
            </div>
            <p className="detail-desc">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* ── Booking Section ── */}
      <div className="container booking-section">
        {/* Showtime Selector */}
        <div className="showtime-selector">
          <h3>Select Showtime</h3>
          <div className="showtime-buttons">
            {movie.showtimes.map((show) => (
              <button
                key={show._id}
                className={`showtime-btn ${selectedShow?._id === show._id ? 'active' : ''}`}
                onClick={() => handleShowtimeChange(show)}
              >
                {show.time}
                <span>{show.totalSeats - show.bookedSeats.length} left</span>
              </button>
            ))}
          </div>
        </div>

        {/* Seat Picker */}
        {selectedShow && (
          <div className="seat-section">
            <h3>Select Seats</h3>
            <SeatPicker
              bookedSeats={selectedShow.bookedSeats}
              selectedSeats={selectedSeats}
              onSeatClick={handleSeatClick}
            />
          </div>
        )}

        {/* Booking Summary */}
        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <div className="summary-card">
              <h3>Booking Summary</h3>
              <div className="summary-row">
                <span>Movie</span>
                <span>{movie.title}</span>
              </div>
              <div className="summary-row">
                <span>Show</span>
                <span>{selectedShow?.time}</span>
              </div>
              <div className="summary-row">
                <span>Seats</span>
                <span className="seats-list">{selectedSeats.join(', ')}</span>
              </div>
              <div className="summary-row">
                <span>Tickets</span>
                <span>{selectedSeats.length}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{selectedSeats.length * PRICE_PER_SEAT}</span>
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={handleBooking}
                disabled={booking}
              >
                {booking ? 'Processing...' : `Confirm Booking — ₹${selectedSeats.length * PRICE_PER_SEAT}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;
