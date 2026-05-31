// pages/MyBookingsPage.js
// Shows all bookings made by the logged-in user

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="bookings-page container fade-in">
      <h1 className="page-title">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="empty-bookings">
          <span className="empty-icon">🎟️</span>
          <p>No bookings yet.</p>
          <a href="/" className="btn btn-primary">Browse Movies</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className={`booking-card card ${booking.status}`}>
              {/* Poster */}
              <img
                className="booking-poster"
                src={booking.movie?.posterUrl || 'https://via.placeholder.com/80x120'}
                alt={booking.movie?.title}
              />

              {/* Details */}
              <div className="booking-details">
                <h3>{booking.movie?.title}</h3>
                <div className="booking-meta">
                  <span>🕐 {booking.showtime}</span>
                  <span>🪑 {booking.seats.join(', ')}</span>
                  <span>🎫 {booking.seats.length} ticket(s)</span>
                  <span>📅 {new Date(booking.bookingDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}</span>
                </div>
              </div>

              {/* Right side: price + status + action */}
              <div className="booking-right">
                <div className="booking-price">₹{booking.totalAmount}</div>
                <span className={`status-badge ${booking.status}`}>
                  {booking.status === 'confirmed' ? '✅ Confirmed' : '❌ Cancelled'}
                </span>
                {booking.status === 'confirmed' && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleCancel(booking._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
